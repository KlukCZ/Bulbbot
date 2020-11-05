const Logger = require("../utils/other/winston");

module.exports = async (client, info) => {
	console.info(info);
	Logger.warn(`Ratelimting ${info}`);
};
