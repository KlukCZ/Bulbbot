const Moderation = require("../../utils/moderation/moderation");
const Log = require("../../utils/moderation/log");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "unban",
	aliases: ["pardon"],
	category: "moderation",
	description: "Unban a user from the server",
	usage: "unban <user> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"MANAGE_MESSAGES",
		"USE_EXTERNAL_EMOJIS",
		"BAN_MEMBERS",
	],
	userPermissions: ["BAN_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`unban|pardon <user> [reason]\`\``
			);
		let target = args[0];
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";

		let whoToUnban = "";

		message.guild.fetchBans().then(async (bans) => {
			bans.forEach((ban) => {
				// Check for id
				if (ban.user.id === target) whoToUnban = ban.user.id;

				// Check for username
				if (ban.user.username.toLowerCase().includes(target.toLowerCase()))
					whoToUnban = ban.user.id;
			});

			if (whoToUnban === "")
				return message.channel.send(
					`Was unable to find user \`\`${target}\`\` in **${message.guild.name}**, try to be a bit more specific or check if they are banned.`
				);

			const user = await client.users.fetch(whoToUnban);

			message.channel
				.send(
					`Are you sure you want to unban **${user.username}**#${user.discriminator} \`\`(${user.id})\`\`?`
				)
				.then((msg) => {
					msg
						.react(Emotes.actions.confirm.replace(/\D/g, "")) // Confrim
						.then(() => msg.react(Emotes.actions.cancel.replace(/\D/g, ""))); // Cancel

					const filter = (reaction, user) => {
						return (
							[
								Emotes.actions.confirm.replace(/\D/g, ""),
								Emotes.actions.cancel.replace(/\D/g, ""),
							].includes(reaction.emoji.id) && user.id === message.author.id
						);
					};

					msg
						.awaitReactions(filter, {
							max: 1,
							time: 60000,
							errors: ["time"],
						})
						.then(async (collected) => {
							const reaction = collected.first();

							if (
								reaction.emoji.id === Emotes.actions.confirm.replace(/\D/g, "")
							) {
								if (
									!(await Moderation.Unban(
										client,
										message.guild.id,
										user,
										message.author,
										reason
									))
								)
									return message.channel.send(
										`Unable to unban <@${user.id}> \`\`(${user.id})\`\`.`
									);
								await Log.Mod_action(
									client,
									message.guild.id,
									`${Emotes.actions.unban} Unbanned **${user.username}**#${user.discriminator} \`\`(${user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
									""
								);

								return message.channel.send(
									`${Emotes.actions.unban} Unbanning <@${whoToUnban}> \`\`(${whoToUnban})\`\` for \`\`${reason}\`\``
								);
							} else {
								return message.channel.send(
									`${Emotes.actions.cancel} Canceling the operation.`
								);
							}
						});
				});
		});
	},
};
