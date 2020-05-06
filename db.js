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
				return Vehicle.query().withGraphFetched("vehicleLicenseState");
			}
		},

		//
		{
			method: "GET",
	        path: "/list-vehicle-types",
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
	        path: "/list-states",
	        config: {
	          description: "Retrieve all states",
	        },
	        handler: (request, h) => {
	          return State.query().select("name");
	        }
		},

		{
			method: "POST",
			path: "/add-vehicle",
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
			  const newVehicle = await Vehicle.query().insert({
				make: request.payload.make,
				model: request.payload.model,
				color: request.payload.color,
				type: request.payload.type,
				capacity: request.payload.capacity,
				mpg: request.payload.mpg,
				licensestate: await State.query().select('id').where('licensestate', '=', request.payload.licensestate),
				licensenumber: request.payload.licensenumber
  	          });

  	          if (newAccount) {
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
			path: "/add-vehicle-type",
			config: {
			  description: "Add a new vehicle type",
			  validate: {
				payload: Joi.object({
				  type: Joi.string().required()
				}),
			  },
			},
			handler: async (request, h) => {
			  const newVehicleType = await Vehicle.query().insert({
				type: request.payload.make
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
