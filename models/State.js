const { Model } = require('objection');

class State extends Model {

	static get tableName() {
		return 'state';
	}

	static get idColumn() {
		return 'abbreviation';
	}

	static get relationMappings() {
		return {

			locations: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Location",
				join: {
					from: 'state.abbreviation',
					to:	'location.state'
				}
			},

			vehicles: {

				relation: Model.HasManyRelation,

				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'state.abbreviation',
					to:	'vehicle.licensestate'
				}

			}
		}
	}
}

module.exports = State;
