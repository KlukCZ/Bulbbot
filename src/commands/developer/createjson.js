const Emotes = require("../../emotes.json");
const fs = require("fs");
const Logger = require("../../utils/other/winston");

module.exports = {
	name: "createjson",
	category: "developer",
	description: "Create the json that is used on the website",
	usage: "createjson",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],
	clearanceLevel: 0,
	run: async (client, message, _args) => {
		const developers = process.env.DEVELOPERS.split(",");

		if (developers.includes(message.author.id)) {
			const categorys = [
				"botinfo",
				"configuration",
				"information",
				"miscellaneous",
				"moderation",
			];

			categorys.forEach((cat) => {
				let msg = "[";

				client.commands.forEach((c) => {
					if (c.category === cat) {
						if (c.aliases === undefined) {
							msg += `
							{
								"name": "${c.name}",
								"category": "${c.category}",
								"description": "${c.description}",
								"usage": "${c.usage}",
								"clearanceLevel": ${c.clearanceLevel},
								"clientPermissions":  [${c.clientPermissions.map((i) => `"${i}"`).join(",")}],
							},
							`;
						} else {
							msg += `
						{
							"name": "${c.name}",
							"aliases": [${c.aliases.map((i) => `"${i}"`).join(",")}],
							"category": "${c.category}",
							"description": "${c.description}",
							"usage": "${c.usage}",
							"clearanceLevel": ${c.clearanceLevel},
							"clientPermissions":  [${c.clientPermissions.map((i) => `"${i}"`).join(",")}],
						},
						`;
						}
					}
				});

				msg += "]";
				fs.writeFile(`./src/commands/developer/${cat}.json`, msg, function (
					err
				) {
					if (err) Logger.error(err);
				});
			});

			return message.channel.send(
				`${Emotes.actions.confirm} Created the json file`
			);
		}
	},
};
