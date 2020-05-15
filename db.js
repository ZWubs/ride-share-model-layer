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
  	              msge: `Couldn"t create vehicle`,
  	            };
  	          }
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
  	              msge: `Couldn"t create vehicle type "${request.payload.type}"`,
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
						firstName: Joi.string().required(),
						lastName: Joi.string().required(),
						licensePlate: Joi.string().required(),
					}),
				},
			},
			handler: async (request, h) => {
				const driver= await Driver.query()
					.where({
						firstname: request.payload.firstName,
						lastname: request.payload.lastName
					})
					.select('id')
					.first()
				console.log(driver.id);
				const vehicle = await Vehicle.query()
					.where('licensenumber', request.payload.licensePlate)
					.select('id')
					.first()
				console.log(vehicle.id);

				const newAuth = await Authorization.query().insert({
					driverid: driver.id,
					vehicleid: vehicle.id
				});
				console.log('d');

				if(newAuth){
					return{
						ok: true,
						msge: `${request.payload.firstName} ${request.payload.lastName} is now authorized to drive the vehicle with a license plate of ${request.payload.licensePlate}.`
					}
				} else {
					return{
						ok: false,
						msge: `Authorization failed.`
					};
				}
			}
		},
		{
			// D2 a Driver up for a ride
			method: "POST",
			path: "/driver-signup",
			config: {
				description: "Signs a Driver up for a Ride",
				validate: {
					payload: Joi.object({
						firstName: Joi.string().required(),
						lastName: Joi.string().required(),
						licensePlate: Joi.string().required(),
					}),
				},
			},
			handler: async (request, h) => {
				const driver= await Driver.query()
					.where({
						firstname: request.payload.firstName,
						lastname: request.payload.lastName
					})
					.select('id')
					.first()
				console.log(driver.id);
				const vehicle = await Vehicle.query()
					.where('licensenumber', request.payload.licensePlate)
					.select('id')
					.first()
				console.log(vehicle.id);

				const newAuth = await Authorization.query().insert({
					driverid: driver.id,
					vehicleid: vehicle.id
				});
				console.log('d');

				if(newAuth){
					return{
						ok: true,
						msge: `${request.payload.firstName} ${request.payload.lastName} is now authorized to drive the vehicle with a license plate of ${request.payload.licensePlate}.`
					}
				} else {
					return{
						ok: false,
						msge: `Authorization failed.`
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
