const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Regex = require("../../utils/other/regex");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "multiban",
	aliases: ["mban"],
	category: "moderation",
	description: "Bans a couple of users inside of guild",
	usage: "multiban <user> [user2]...[reason]",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`users\`\`\n${Emotes.other.tools} Correct usage of command: \`\`multiban <user> [user2]...[reason]\`\``
			);

		const targets = args.slice(0).join(" ").match(Regex.USER_MENTION_USER_ID);
		let reason = args.slice(0).join("").replace(Regex.USER_MENTION_USER_ID, "");

		if (reason === "") reason = "No reason given";
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			let target = targets[i].replace(/\D/g, "");
			let t = await client.users.fetch(target);

			if (
				!(await Moderation.Ban(
					client,
					message.guild.id,
					target,
					message.author,
					reason
				))
			)
				message.channel.send(`Unable to ban <@${target}> \`\`(${target})\`\`.`);
			fullList += `**${t.username}**#${t.discriminator} \`\`(${t.id})\`\`, `;
		}

		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.ban} Multiple targets were banned ${fullList} by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
			""
		);
		message.channel.send(
			`${Emotes.actions.ban} Banned ${fullList} for \`\`${reason}\`\``
		);
	},
};
