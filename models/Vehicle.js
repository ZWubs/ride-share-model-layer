const { Model } = require('objection');

class Vehicle extends Model {

	static get tableName() {
		return 'vehicle';
	}

	static get relationMappings() {
		return {

			authorization: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Driver",
				join: {
					from: 'driver.id',
					through: {
						from: 'authorization.driverId',
						to: 'authorization.vehicleId'
					},
					to: 'vehicle.id'
				}

			},

			rides: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'ride.id',
					to: 'vehicle.id'
				}

			}

		}
	}
}

module.exports = Vehicle;
