const { Model } = require('objection');

class Administrator extends Model {

	static get tableName() {
		return 'administrator';
	}
}

module.exports = Administrator;
