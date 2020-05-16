const { Model } = require('objection');

class RideDriver extends Model {

    static get tableName() {
        return 'drivers';
    }

    static get idColumn(){
        return['driverid', 'rideid'];
    }

    static get relationMappings() {
        return {

            driver: {

                relation: Model.BelongsToOneRelation,

                modelClass: __dirname + "/Driver",
                join: {
                    from: 'drivers.driverid',
                    to: 'driver.id',
                }

            },
            ride: {
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Ride",
                join: {
                    from: 'drivers.rideid',
                    to: 'ride.id'
                }
            }
        }
    }
}

module.exports = RideDriver;
