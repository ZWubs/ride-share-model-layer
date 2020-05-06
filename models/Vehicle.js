const { Model } = require('objection');

class Vehicle extends Model {

	static get tableName() {
		return 'vehicle';
	}

	static get relationMappings() {
		return {

			authorizations: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Driver",
				join: {
					from: 'driver.id',
					through: {
						from: 'authorizations.driverid',
						to: 'authorizations.vehicleid'
					},
					to: 'vehicle.id'
				}

			},

			rides: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'vehicle.id',
					to: 'ride.vehicleid'
				}

			},

			vehicleType: {

				relation: Model.HasOneRelation,

				modelClass: __dirname + "/VehicleType",
				join: {
					from: 'vehicletype.id',
					to: 'vehicle.vehicletypeid',
				}

			},

			vehicleLicenseState: {

				relation: Model.HasOneRelation,

				modelClass: __dirname + "/State",
				join: {
					from: 'state.abbreviation',
					to: 'vehicle.licensestate',
				}

			}

		}
	}
}

module.exports = Vehicle;
