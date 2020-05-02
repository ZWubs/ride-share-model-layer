const { Model } = require('objection');

class VehicleType extends Model {

	static get tableName() {
		return 'vehicletype';
	}


	static get relationMappings() {
		return {

			vehiclesOfType: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'vehicletype.id',
					to: 'vehicle.vehicletypeid',
				}

			},

		}
	}
}

module.exports = VehicleType;
