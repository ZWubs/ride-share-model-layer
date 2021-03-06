// Configure Knex.
const knex = require("knex")({
	client: "pg",
	connection: {
		host: "faraday.cse.taylor.edu", // PostgreSQL server
	    user: "zachary_winters", // Your user name
	    password: "kotecove", // Your password
	    database: "zachary_winters"
	}
});

// Configure Objection.
const { Model } = require("objection");
Model.knex( knex );

//Import Models
const Driver = require("./models/Driver.js");
const Vehicle = require("./models/Vehicle.js");
const VehicleType = require("./models/VehicleType.js")
const Ride = require("./models/Ride.js");
const Location = require("./models/Location.js");
const State = require("./models/State.js");
const Passenger = require("./models/Passenger.js");
const Authorization = require("./models/Authorization");
const RideDriver = require("./models/RideDriver");
const RidePassenger = require("./models/RidePassenger");
const Administrator = require("./models/Administrator");
const Accounts = require("./models/Accounts");

// Configure Hapi.
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi");

const server = Hapi.server({
  port: 3000,
  host: "localhost",
  routes: {
    cors: true,
  },
});

async function init() {
	// Output endpoints at startup.
	await server.register(require("blipp"));

	// Log stuff.
	await server.register({
		plugin: require("hapi-pino"),
		options: {
			prettyPrint: true
		}
	});

	/**
	 *	Handle creating a new vehicle
	 */
	server.route([
		{
			method: "GET",
			path: "/",
			handler: function( request, h ) {
				return Ride.query().withGraphFetched("drivers");
			}
		},
		{
			//Returns an array of all Rides
			method: "GET",
			path: "/rides",
			config: {
				description: "Retrieve all Rides and related information",
			},
			handler: (request, h) => {
				return Ride.query().withGraphFetched('[drivers, passengers, vehicle, toLocation, fromLocation]');
			},
		},

    {
			//Returns an array of all Vehicles
			method: "GET",
			path: "/vehicles",
			config: {
				description: "Retrieve all Vehicless and related information",
			},
			handler: (request, h) => {
				return Vehicle.query();
			},
		},
		//
		{
			method: "GET",
	        path: "/vehicle-types",
	        config: {
	          description: "Retrieve all vehicle types",
	        },
	        handler: (request, h) => {
	          return VehicleType.query().select("type");
	        }
		},

		//
		{
			method: "GET",
	        path: "/states",
	        config: {
	          description: "Retrieve all states",
	        },
	        handler: (request, h) => {
	          return State.query().select("name");
	        }
		},

		{
			method: "GET",
	        path: "/passengers",
	        config: {
	          description: "Retrieve all passengers",
	        },
	        handler: (request, h) => {
	          return Passenger.query();
	        }
		},

		{
			method: "GET",
	        path: "/drivers",
	        config: {
	          description: "Retrieve all drivers",
	        },
	        handler: (request, h) => {
	          return Driver.query();
	        }
		},

		{
			method: "GET",
	        path: "/administrators",
	        config: {
	          description: "Retrieve all administrators",
	        },
	        handler: (request, h) => {
	          return Administrator.query();
	        }
		},

		{
// import RideSignup from "./pages/RideSignup.vue";
			method: "POST",
			path: "/vehicle",
			config: {
			  description: "Add a new vehicle",
			  validate: {
				payload: Joi.object({
				  make: Joi.string().required(),
				  model: Joi.string().required(),
				  color: Joi.string().required(),
				  type: Joi.string().required(),
				  capacity: Joi.number().integer().required(),
				  mpg: Joi.number().required(),
				  licensestate: Joi.string().required(),
				  licensenumber: Joi.string().required()
				}),
			  },
			},
			handler: async (request, h) => {

              let licensestate = await State.query().select('abbreviation').where('name', '=', request.payload.licensestate);
              let vehicletypeid = await VehicleType.query().select('id').where('type', '=', request.payload.type);

			  const newVehicle = await Vehicle.query().insert({
				make: request.payload.make,
				model: request.payload.model,
				color: request.payload.color,
				vehicletypeid: vehicletypeid[0].id,
				capacity: request.payload.capacity,
				mpg: request.payload.mpg,
				licensestate: licensestate[0].abbreviation,
				licensenumber: request.payload.licensenumber
  	          });

  	          if (newVehicle) {
  	            return {
  	              ok: true,
  	              msge: `Created vehicle`,
  	            };
  	          } else {
  	            return {
  	              ok: false,
  	              msge: `Couldn't create vehicle`,
  	            };
  	          }
			},
		},

		{
			method: "GET",
			path:"/getVehicles",
			config: {
				description: "Retrieve a list of all vehicles in the database.",
			},
			handler: (request, h) => {
				return Vehicle.query().select("id");
			},
		},

		{
			method: "GET",
			path:"/locations",
			config: {
				description: "Retrieve a list of all locations in the database.",
			},
			handler: (request, h) => {
				return Location.query().select("id");
			},
		},

		//
		{
			method: "POST",
			path: "/vehicle-type",
			config: {
			  description: "Add a new vehicle type",
			  validate: {
				payload: Joi.object({
				  type: Joi.string().required()
				}),
			  },
			},
			handler: async (request, h) => {
				console.log( request.payload.type )
			  const newVehicleType = await VehicleType.query().insert({
				type: request.payload.type
  	          	  });

  	          if (newVehicleType) {
  	            return {
  	              ok: true,
  	              msge: `Created vehicle type`,
  	            };
  	          } else {
  	            return {
  	              ok: false,
  	              msge: `Couldn't create vehicle type "${request.payload.type}"`,
  	            };
  	          }
			},
		},
		{
			//A5: Authorize a driver to a vehicle
			method: "POST",
			path: "/authorization",
			config: {
				description: "Authorize a driver to a Vehicle",
				validate: {
					payload: Joi.object({
						driverId: Joi.number().required(),
						vehicleId: Joi.number().required(),
					}),
				},
			},
			handler: async (request, h) => {
				const newAuth = await Authorization.query().insert({
					driverid: request.payload.driverId,
					vehicleid: request.payload.vehicleId
				});
				const driver = await Driver.query().findById(request.payload.driverId).first();
				const vehicle = await Vehicle.query().findById(request.payload.vehicleId).first();

				if(newAuth){
					return{
						ok: true,
						msge: `${driver.firstname} ${driver.lastname} is now authorized to drive the vehicle with a license plate of ${vehicle.licensenumber}.`
					}
				} else {
					return{
						ok: false,
						msge: `Authorization failed.`
					};
				}
			}
		},

		// Retrieve all existing rides.
		{
			method: "GET",
			path: "/get-rides",
			config: {
				description: "Retrieve All Rides in Database"
			},
			handler: async ( request, h ) => {
				return Ride.query();
			},

		},

		// Add a New Ride
		{
			method: "POST",
			path: "/ride",
			config: {
				description: "Add a new Ride",
				validate: {
					payload: Joi.object({
						date: Joi.string().required(),
						time: Joi.string().required(),
						vehicleId: Joi.number().required(),
						fuelPrice: Joi.number().required(),
						fee: Joi.number().required(),
						distance: Joi.number().required(),
						fromLocationId: Joi.number().required(),
						toLocationId: Joi.number().required(),
					}),
				},
			},
			handler: async ( request, h ) => {
				console.log( request.payload )
				// let fromLocationId = await Location.query().select('id').where('city', '=', request.payload.city);
				const newRide = await Ride.query().insert({
					date: request.payload.date,
					time: request.payload.time,
					vehicleid: request.payload.vehicleId,
					fuelprice: request.payload.fuelPrice,
					fee: request.payload.fee,
					distance: request.payload.distance,
					fromlocationid: request.payload.fromLocationId,
					tolocationid: request.payload.toLocationId,
				});
				if ( newRide ) {
					return {
						ok: true,
						msge: `Created new ride.`,
					};
				} else {
					return {
						ok: false,
						msge: `Couldn't create new ride!`,
					};
				}
			},
		},

		// Update an Existing Ride
		{
			method: "PUT",
			path: "/ride",
			config: {
				description: "Update an Existing Ride",
				validate: {
					payload: Joi.object({
						id: Joi.number().required(),
						date: Joi.string().required(),
						time: Joi.string().required(),
						vehicleId: Joi.number().required(),
						fuelPrice: Joi.number().required(),
						fee: Joi.number().required(),
						distance: Joi.number().required(),
						fromLocationId: Joi.number().required(),
						toLocationId: Joi.number().required(),
					}),
				},
			},
			handler: async ( request, h ) => {
				const thisRide = await Ride.query()
				.where({ id: request.payload.id })
				.insert({
					date: request.payload.date,
					time: request.payload.time,
					vehicleid: request.payload.vehicleId,
					fuelprice: request.payload.fuelPrice,
					fee: request.payload.fee,
					distance: request.payload.distance,
					fromlocationid: request.payload.fromLocationId,
					tolocationid: request.payload.toLocationId,
				});
				if ( thisRide ) {
					return {
						ok: true,
						msge: `Ride updated.`,
					};
				} else {
					return {
						ok: false,
						msge: `Couldn't update ride!`,
					};
				}
			},
		},

		{
			// D2 a Driver up for a ride
			method: "POST",
			path: "/driver-signup",
			config: {
				description: "Signs a Driver up for a Ride",
				validate: {
					payload: Joi.object({
						accountId: Joi.number().required(),
						rideId: Joi.number().required(),
					}),
				},
			},
			handler: async (request, h) => {
			    const driverAuths = await Driver.query()
					.where('accountid', request.payload.accountId)
					.withGraphFetched("authorizations")
					.first();

			    const rideInfo= await Ride.query().findById(request.payload.rideId)
					.withGraphFetched('vehicle');
			    console.log(driverAuths.authorizations);

			    for (let i =0; i<driverAuths.authorizations.length;i++){
			    	if(rideInfo.vehicle.id === driverAuths.authorizations[i].id){
						const newDriver = await RideDriver.query().insert({
							driverid: driverAuths.id,
							rideid: request.payload.rideId,
						});

						if(newDriver){
							return{
								ok: true,
								msge: `${driverAuths.firstname} ${driverAuths.lastname} is signed up to drive for Ride ${request.payload.rideId}.`
							}
						} else {
							return{
								ok: false,
								msge: `Authorization failed.`
							};
						}

					}
				}
				//If driver not auth to vehicle, return error
			     return{
					ok: false,
				 	msge: `You are not authorized to drive Vehicle.`
				 }
			}
		},
		{
			// P2 a Passenger up for a ride
			method: "POST",
			path: "/passenger-signup",
			config: {
				description: "Signs a passenger up for a Ride",
				validate: {
					payload: Joi.object({
						accountId: Joi.number().required(),
						rideId: Joi.number().required(),
					}),
				},
			},
			handler: async (request, h) => {
				const passenger = await Passenger.query()
					.where('accountid', request.payload.accountId)
					.first();

				const newPassenger = await RidePassenger.query().insert({
					passengerid: passenger.id,
					rideid: request.payload.rideId,
				});

				if (newPassenger) {
					return {
						ok: true,
						msge: `${passenger.firstname} ${passenger.lastname} is signed up for Ride ${request.payload.rideId}.`
					}
				} else {
					return {
						ok: false,
						msge: `Sign up failed.`
					};
				}
			}
		},
		{
			method: "GET",
			path: "/address/{id}",
			config: {
				description: "Get an address for a location",
			},
			handler: async (request, h)=>{
				let anAddress = await Location.query()
					.select('address', 'city', 'state', 'zipcode')
					.where('id', request.params.id)
					.first();
				return anAddress;
			},
		},

		/**
		 *	Create a passenger account
		 */
		{
			method: "POST",
			path: "/passenger",
			config: {
			  description: "Add a new passenger account",
			  validate: {
				payload: Joi.object({
				  firstname: Joi.string().required(),
				  lastname: Joi.string().required(),
				  phone: Joi.string().required(),
				}),
			  },
			},
			handler: async (request, h) => {

              let account = await Accounts.query().insert({});
			  let accountID = account.id;
			  const newPassenger = await Passenger.query().insert({
				firstname: request.payload.firstname,
				lastname: request.payload.lastname,
				phone: request.payload.phone,
				accountid: accountID
  	          });

  	          if ( newPassenger ) {
  	            return {
  	              ok: true,
  	              msge: `Successfully created a new passenger account with id: '${accountID}'`,
  	            };
  	          } else {
  	            return {
  	              ok: false,
  	              msge: `Couldn"t create a  new passenger account`,
  	            };
  	          }
			},
		},

		/**
		 *	Create a driver account
		 */
		{
			method: "POST",
			path: "/driver",
			config: {
			  description: "Add a new driver account",
			  validate: {
				payload: Joi.object({
				  firstname: Joi.string().required(),
				  lastname: Joi.string().required(),
				  phone: Joi.string().required(),
				  licensenumber: Joi.string().required()
				}),
			  },
			},
			handler: async (request, h) => {

              let account = await Accounts.query().insert({});
			  let accountID = account.id;
			  const newDriver = await Driver.query().insert({
				firstname: request.payload.firstname,
				lastname: request.payload.lastname,
				phone: request.payload.phone,
				licensenumber: request.payload.licensenumber,
				accountid: accountID
  	          });

  	          if ( newDriver ) {
  	            return {
  	              ok: true,
  	              msge: `Successfully created a new driver account with id: '${accountID}'`,
  	            };
  	          } else {
  	            return {
  	              ok: false,
  	              msge: `Couldn"t create a new driver account`,
  	            };
  	          }
			},
		}
	]);

	console.log("Server listening on", server.info.uri);
	await server.start();

};

process.on("unhandledRejection", (err) => {
  console.log( err );
  process.exit(1);
});

init();
