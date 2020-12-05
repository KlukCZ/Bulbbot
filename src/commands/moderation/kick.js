const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "kick",
	category: "moderation",
	description: "Kicks a user from the guild",
	usage: "kick <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"KICK_MEMBERS",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: ["KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`kick <user> [reason]\`\``
			);
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";
		if (user === null) return message.channel.send("User is not in guild.");

		if (
			!(await Moderation.Kick(
				client,
				message.guild.id,
				target,
				message.author,
				reason
			))
		)
			return message.channel.send(
				`Unable to kick <@${target}> \`\`(${target})\`\`.`
			);
		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.kick} Kicked **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
			""
		);

		message.channel.send(
			`${Emotes.actions.kick} Kicking <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``
		);
	},
};
