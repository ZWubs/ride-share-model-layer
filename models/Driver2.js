const { Model } = require('objection');

class Driver extends Model {

	static get tableName() {
		return 'driver';
	}

	static get idColumn() {
		return 'id';
	}

}

module.exports = Driver;
