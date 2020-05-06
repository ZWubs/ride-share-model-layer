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
  host: "localhost",
  port: 3000,
  routes: {
    cors: true,
  },
});

async function init() {

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
