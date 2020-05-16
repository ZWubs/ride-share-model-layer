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
					from: 'ride.id',
					through: {
						from: 'drivers.rideid',
						to: 'drivers.driverid'
					},
					to: 'driver.id'
				}

			},

			/*
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
			*/

			vehicle: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/Vehicle",
				join: {
					from: 'vehicle.id',
					to: 'ride.vehicleid'
				}

			},

			passengers: {

				relation: Model.ManyToManyRelation,

				modelClass: __dirname + "/Passenger",
				join: {
					from: 'ride.id',
					through: {
						from: 'passengers.rideid',
						to: 'passengers.passengerid'
					},
					to: 'passenger.id'
				}

			},

			fromLocation: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/Location",
				join: {
					from: 'ride.fromlocationid',
					to: 'location.id'
				}

			},

			toLocation: {

				relation: Model.BelongsToOneRelation,

				modelClass: __dirname + "/Location",
				join: {
					from: 'ride.tolocationid',
					to: 'location.id'
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
