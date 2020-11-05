const Logger = require("../utils/other/winston");

module.exports = async (client, info) => {
	Logger.warn(`Warning ${info}`);
};
