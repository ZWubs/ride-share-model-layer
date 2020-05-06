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

// Configure Hapi.
const Joi = require("@hapi/joi"); // Input validation
const Hapi = require("@hapi/hapi");

const init = async () => {
	const server = Hapi.server({
		host: "localhost",
		port: 3000,
		routes: {
			cors: true
		}
	})

	// Output endpoints at startup.
	await server.register({
		plugin: require("blipp"),
		options: { showAuth: true }
	})

	// Log stuff.
	await server.register({
		plugin: require("hapi-pino"),
		options: {
			prettyPrint: true
		}
	});

	server.route([
		{
			method: "GET",
			path: "/",
			handler: function( request, h ) {
				return Location.query().withGraphFetched('locationState');
			}
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
				const driver_id= await Driver.query()
					.where({
						firstname: request.payload.firstName,
						lastname: request.payload.lastName
					})
					.select('id')
					.first()

				const vehicle_id = await Vehicle.query()
					.where('licensenumber', request.payload.licensePlate)
					.select('id')
					.first()

				const newAuth = await Authorization.query().insert({
					driverid: driver_id,
					vehicleid: vehicle_id
				});

				if(newAuth){
					return{
						ok: true,
						msge: `${request.payload.firstname} ${request.payload.lastname} is now authorized to drive the vehicle with a license plate of ${request.payload.licenseplate}.`
					}
				} else {
					return{
						ok: false,
						msge: `Authorization failed.`
					};
				}
			}
		}
	]);

	console.log("Server listening on", server.info.uri);
	await server.start();

};

init();
