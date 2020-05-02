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
					to:	'ride.fromlocationid'
				}
			},

			toLocation: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'location.id',
					to: 'ride.tolocationid'
				}
			},

			locationState: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/State",
				join: {
					from: 'state.abbreviation',
					to: 'location.state'
				}

			},
		}
	}
}

module.exports = Location;
