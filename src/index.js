const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const fs = require("fs");
const { resolve } = require("path");
const cron = require("node-cron");
const CommandJobs = require("./utils/cronjob/command");
const Logger = require("./utils/other/winston");
const client = new Client();

client.commands = new Collection();
client.aliases = new Collection();
client.mongoose = require("./utils/database/mongoose");

client.categories = fs.readdirSync(resolve(__dirname, "./commands/"));

config({
	path: `${__dirname}/.env`,
});

["command"].forEach((handler) => {
	require(`./handlers/${handler}`)(client);
});

fs.readdir(resolve(__dirname, "./events/"), (err, files) => {
	if (err) Logger.error(err);
	files.forEach((file) => {
		if (!file.endsWith(".js")) return;
		const evt = require(`./events/${file}`);
		let evtName = file.split(".")[0];
		client.on(evtName, evt.bind(null, client));
	});
});

// Run this every 30 seconds
cron.schedule("*/30 * * * * *", () => {
	CommandJobs.Mute(client);
	CommandJobs.Remind(client);
});

client.mongoose.init();
client.login(process.env.TOKEN);
