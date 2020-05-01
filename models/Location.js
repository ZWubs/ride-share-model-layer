const { Model } = require('objection');

class Location extends Model {

	static get tableName() {
		return 'location';
	}

	static get relationMappings() {
		return {

			fromLocation: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'location.id',
					to: 'ride.fromLocationId',
				}

			},

			toLocation: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'location.id',
					to: 'ride.toLocationId'
				}

			}

		}
	}
}

module.exports = Location;
