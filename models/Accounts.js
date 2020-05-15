const { Model } = require('objection');

class Accounts extends Model {

	static get tableName() {
		return 'accounts';
	}

}

module.exports = Accounts;
