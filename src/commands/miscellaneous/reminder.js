const Discord = require("discord.js");
const mongoose = require("mongoose");
const parse = require("parse-duration");

const Remind = require("../../models/remind");
const Logger = require("../../utils/other/winston");
const Validate = require("../../utils/helper/validate");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "remind",
	aliases: ["reminder", "r", "🕰️"],
	category: "miscellaneous",
	description: "Reminds you of something",
	usage: "remind <duration> <reminder>",
	clientPermissions: [
		"EMBED_LINKS",
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"ADD_REACTIONS",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		if (!args[0])
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder> \`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);
		if (!args[1])
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`reminder\`\`\n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder> \`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);

		const duration = args[0];
		let unixDuration = parse(duration);
		if (unixDuration < parse("1s"))
			return message.channel.send(
				`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be shorter than 1 second \n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);
		if (unixDuration > parse("1y"))
			return message.channel.send(
				`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be longer than 1 year \n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder>\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			)
			.setTitle("Where do you want to get reminded?")
			.setDescription(
				`
${Emotes.other.plus} **Here**
${Emotes.other.minus} **In dms**
${Emotes.actions.cancel} **Cancel**

                `
			);
		message.channel.send(embed).then(async (msg) => {
			await msg
				.react(Emotes.other.plus.replace(/\D/g, ""))
				.then(() => msg.react(Emotes.other.minus.replace(/\D/g, "")))
				.then(() => msg.react(Emotes.actions.cancel.replace(/\D/g, "")));

			const filter = (reaction, user) => {
				return (
					[
						Emotes.other.plus.replace(/\D/g, ""),
						Emotes.other.minus.replace(/\D/g, ""),
						Emotes.actions.cancel.replace(/\D/g, ""),
					].includes(reaction.emoji.id) && user.id === message.author.id
				);
			};

			msg
				.awaitReactions(filter, {
					max: 1,
					time: 30000,
					errors: ["time"],
				})
				.then(async (collected) => {
					const reaction = collected.first();
					if (reaction.emoji.id === Emotes.actions.cancel.replace(/\D/g, ""))
						return message.channel.send(
							`${Emotes.actions.cancel} Canceling the operation.`
						);
					else if (reaction.emoji.id === Emotes.other.plus.replace(/\D/g, "")) {
						let msg = await Validate.Master(
							client,
							args.slice(1).join(" "),
							message.guild
						);
						// in that channel
						const remind = new Remind({
							_id: mongoose.Types.ObjectId(),
							userID: message.author.id,
							dmRemind: false,
							channelID: message.channel.id,
							reminder: msg,
							expireTime:
								Math.floor(new Date().getTime() / 1000) + unixDuration / 1000,
						});
						remind.save().catch((err) => Logger.error(err));

						return message.channel.send(
							`${Emotes.actions.confirm} Reminding you in **${duration}** here.`
						);
					} else if (
						reaction.emoji.id === Emotes.other.minus.replace(/\D/g, "")
					) {
						// In dms
						const remind = new Remind({
							_id: mongoose.Types.ObjectId(),
							userID: message.author.id,
							dmRemind: true,
							channelID: "",
							guildID: "",
							reminder: args.slice(1).join(" "),
							expireTime:
								Math.floor(new Date().getTime() / 1000) + unixDuration / 1000,
						});
						remind.save().catch((err) => cLogger.error(err));

						return message.channel.send(
							`${Emotes.actions.confirm} Reminding you in **${duration}** in dms.`
						);
					} else
						return message.channel.send(
							`${Emotes.actions.cancel} Canceling the operation.`
						);
				})
				.catch((_) => {
					message.channel.send(
						`${Emotes.actions.cancel} Canceling the operation.`
					);
				});
		});
	},
};
