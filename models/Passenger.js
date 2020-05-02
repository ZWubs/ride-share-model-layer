const { Model } = require('objection');

class Passenger extends Model {

	static get tableName() {
		return 'passenger';
	}

	static get relationMappings() {
		return {

			rides: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'passenger.id',
					through: {
						from: 'passengers.passengerid',
						to: 'passengers.rideid'
					},
					to: 'ride.id',
				}

			}

		}
	}
}

module.exports = Passenger;
