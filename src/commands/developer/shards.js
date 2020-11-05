const Discord = require("discord.js");

module.exports = {
	name: "shards",
	category: "developer",
	description: "Get some analytics",
	usage: "shards",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		let developers = process.env.DEVELOPERS.split(",");

		if (developers.includes(message.author.id)) {
			//console.log(client.shard);
			let embed = new Discord.MessageEmbed()
				.setColor(process.env.COLOR)
				.setTimestamp()
				.setFooter(
					`Executed by ${message.author.username}#${message.author.discriminator}`,
					message.author.avatarURL()
				)
				.setTitle(`Shard info | Total shards ${client.options.shardCount}`);

			return message.channel.send(embed);
		}
	},
};
