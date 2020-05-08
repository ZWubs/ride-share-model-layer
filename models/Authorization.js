const { Model } = require('objection');

class Authorization extends Model {

    static get tableName() {
        return 'authorizations';
    }

    static get idColumn(){
        return['driverid', 'vehicleid'];
    }

    static get relationMappings() {
        return {

            driver: {

                relation: Model.BelongsToOneRelation,

                modelClass: __dirname + "/Driver",
                join: {
                    from: 'authorizations.id',
                    to: 'driver.id',
                }

            },
            vehicle:{
                relation: Model.BelongsToOneRelation,
                modelClass: __dirname + "/Vehicle",
                join: {
                    from: 'authorizations.vehicleid',
                    to: 'vehicle.id'
                }
            }
        }
    }
}

module.exports = Authorization;
