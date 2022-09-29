const sequelize = require('../sequelize');

async function reset() {

	await sequelize.sync({ force: true });

	console.log('Done!');
}

reset();