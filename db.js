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

const Driver = require("./models/Driver.js");
const Vehicle = require("./models/Vehicle.js");
const VehicleType = require("./models/VehicleType.js")
const Ride = require("./models/Ride.js");
const Location = require("./models/Location.js");
const State = require("./models/State.js");
const Passenger = require("./models/Passenger.js");

// Configure Hapi.
const Hapi = require("@hapi/hapi");

const init = async () => {
	const server = Hapi.server({
		host: "localhost",
		port: 3000
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
		}
	]);

	console.log("Server listening on", server.info.uri);
	await server.start();

};

init();
