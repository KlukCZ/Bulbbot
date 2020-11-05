const { config } = require("dotenv");
config({
	path: `${__dirname}/.env`,
});
const Logger = require("./utils/other/winston");
const { ShardingManager } = require("discord.js");
const Manager = new ShardingManager("./src/index.js", {
	token: process.env.TOKEN,
	totalShards: 3,
	shardList: "auto",
	respawn: true,
});

Manager.on("shardCreate", (shard) => {
	Logger.info(`Spawned shard ${shard.id}`);
});
Manager.on("disconnect", (shard) => {
	Logger.info(`Shard ${shard.id} disconnected`);
});
Manager.on("reconnecting", (shard) => {
	Logger.info(`Shard ${shard.id} is reconnecting`);
});
Manager.on("death", (shard) => {
	Logger.info(`Shard ${shard.id} died`);
});

Manager.spawn().catch((err) => Logger.error(err));
