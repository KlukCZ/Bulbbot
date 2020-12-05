const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "softban",
	aliases: ["cleanban"],
	category: "moderation",
	description: "Bans and unbans a user from a guild clearing their messages",
	usage: "softban <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"BAN_MEMBERS",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: ["BAN_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`softban|cleanban <user> [reason]\`\``
			);
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";
		if (user === null) {
			return await message.channel.send("User is not in guild.");
		} else {
			if (
				!(await Moderation.Softban(
					client,
					message.guild.id,
					target,
					message.author,
					reason
				))
			)
				return message.channel.send(
					`Unable to softban <@${target}> \`\`(${target})\`\`.`
				);
			user = user.user;
		}

		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.ban} Softbanned **${user.username}**#${user.discriminator} \`\`(${user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
			""
		);

		message.channel.send(
			`${Emotes.actions.ban} Softbanning <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``
		);
	},
};
