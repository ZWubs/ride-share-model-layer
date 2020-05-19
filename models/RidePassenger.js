const { Model } = require('objection');

class RidePassenger extends Model {

    static get tableName() {
        return 'passengers';
    }

    static get idColumn(){
        return['passengerid', 'rideid'];
    }

    static get relationMappings() {
        return {

            passenger: {

                relation: Model.BelongsToOneRelation,

                modelClass: __dirname + "/Passenger",
                join: {
                    from: 'passengers.driverid',
                    to: 'driver.id',
                }

            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'passengers.rideid',
                    to: 'ride.id'
                }
            }
        }
    }
}

module.exports = RidePassenger;
