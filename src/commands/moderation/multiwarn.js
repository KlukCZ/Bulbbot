const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Regex = require("../../utils/other/regex");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "multiwarn",
	aliases: ["mwarn"],
	category: "moderation",
	description: "Warns a couple of users inside of guild",
	usage: "multiwarn <user> [user2]...[reason]",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`users\`\`\n${Emotes.other.tools} Correct usage of command: \`\`multiwarn <user> [user2]...[reason]\`\``
			);

		const targets = args.slice(0).join(" ").match(Regex.USER_MENTION_USER_ID);
		let reason = args.slice(0).join("").replace(Regex.USER_MENTION_USER_ID, "");

		if (reason === "") reason = "No reason given";
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			const target = targets[i].replace(/\D/g, "");
			let t = await client.users.fetch(target);

			await Moderation.Warn(
				client,
				message.guild.id,
				target,
				message.author,
				reason
			);
			fullList += `**${t.username}**#${t.discriminator} \`\`(${t.id})\`\`, `;
		}

		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.warn} Multiple targets were warned ${fullList} by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
			""
		);
		message.channel.send(
			`${Emotes.actions.warn} Warned ${fullList} for \`\`${reason}\`\``
		);
	},
};
