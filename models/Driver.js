const { Model } = require('objection');

class Driver extends Model {

	static get tableName() {
		return 'driver';
	}

	static get relationMappings() {
		return {

			authorization: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'vehicle.id',
					through: {
						from: 'authorization.vehicleId',
						to: 'authorization.driverId'
					},
					to: 'driver.id'
				}

			},

			drivers: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'ride.id',
					through: {
						from: 'drivers.rideId',
						to: 'drivers.driverId'
					},
					to: 'driver.id'
				}

			}

		}
	}
}

module.exports = Driver;
