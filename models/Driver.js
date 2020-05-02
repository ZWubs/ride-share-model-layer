const { Model } = require('objection');

class Driver extends Model {

	static get tableName() {
		return 'driver';
	}

	static get relationMappings() {
		return {

			authorizations: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'vehicle.id',
					through: {
						from: 'authorizations.vehicleid',
						to: 'authorizations.driverid'
					},
					to: 'driver.id'
				}

			},

			rides: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'driver.id',
					through: {
						from: 'drivers.driverid',
						to: 'drivers.rideid'
					},
					to: 'ride.id'
				}

			}

		}
	}
}

module.exports = Driver;
