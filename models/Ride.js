const { Model } = require('objection');

class Ride extends Model {

	static get tableName() {
		return 'ride';
	}

	static get relationMappings() {
		return {

			drivers: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Driver",
				join: {
					from: 'driver.id',
					through: {
						from: 'drivers.driverId',
						to: 'drivers.rideId'
					},
					to: 'ride.id'
				}

			},

			vehicle: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'vehicle.id',
					to: 'ride.id'
				}

			},

			passengers: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Passenger",
				join: {
					from: 'passenger.id',
					through: {
						from: 'passengers.passengerId',
						to: 'passengers.rideId'
					},
					to: 'ride.id'
				}

			},

			fromLocation: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/Location",
				join: {
					from: 'location.id',
					to: 'ride.fromLocationId'
				}

			},

			toLocation: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/Location",
				join: {
					from: 'location.id',
					to: 'ride.toLocationId'
				}

			},

		}
	}
}

module.exports = Ride;

/*
children: {
	relation: Model.HasManyRelation,
	modelClass: Person,
	join: {
	  from: 'persons.id',
	  to: 'persons.parentId'
	}
  },

  parent: {
	relation: Model.BelongsToOneRelation,
	modelClass: Person,
	join: {
	  from: 'persons.parentId',
	  to: 'persons.id'
	}
  }
*/
