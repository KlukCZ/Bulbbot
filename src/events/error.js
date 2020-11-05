const Logger = require("../utils/other/winston");

module.exports = async (client, error) => {
	Logger.error(`Connection error ${error}`);
};
