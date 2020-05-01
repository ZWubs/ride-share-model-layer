const { Model } = require('objection');

class Passenger extends Model {

	static get tableName() {
		return 'passenger';
	}

	static get relationMappings() {
		return {

			passengers: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Ride",
				join: {
					from: 'ride.id',
					through: {
						from: 'passengers.rideId',
						to: 'passengers.passengerId'
					},
					to: 'passenger.id'
				}

			}

		}
	}
}

module.exports = Passenger;
