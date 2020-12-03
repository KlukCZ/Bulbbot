const Guild = require("../../models/guild");

const Log = require("./log");
const Regex = require("../other/regex");
const Translator = require("../lang/translator");

module.exports = {
	Master: async (client, string, guild, message) => {
		const guildObject = await Guild.findOne(
			{ guildID: message.guild.id },
			async (_err, _g) => {
				//if (err) Logger.error(err);
			}
		);

		let authorClearance = 0;
		if (
			message.author.id === message.guild.ownerID ||
			message.member.hasPermission("ADMINISTRATOR")
		)
			authorClearance = 100;
		else {
			guildObject.moderationRoles.forEach((o) => {
				if (
					message.member.roles.cache.has(o.roleId) &&
					authorClearance < o.clearanceLevel
				)
					authorClearance = o.clearanceLevel;
			});
		}

		const AutoMod = guildObject.automoderation;

		if (!AutoMod.enabled) return;
		if (authorClearance >= 50) return;

		if (
			InviteLinks(string, AutoMod.removeInviteLinks) &&
			AutoMod.removeInviteLinks.enabled
		) {
			message.delete();
			/*
			 * Please log this as a separate action, not Mod_Action. That way the user has control over what channel it gets logged to.
			 * Can be left as Mod_Action as well but I'll log twice
			 */
			await Log.Mod_action(
				client,
				guild,
				Translator.Translate("automod_violation_log", {
					user: message.author.username,
					user_id: message.author.id,
					user_discriminator: message.author.discriminator,
					filter: "DISALLOWED_INVITE",
					content: message.content,
					channel_id: message.channel.id,
				}),
				""
			);
		}

		if (
			BlackListedWords(string, AutoMod.blacklistedWords) &&
			AutoMod.blacklistedWords.enabled
		) {
			message.delete();
			await Log.Mod_action(
				client,
				guild,
				Translator.Translate("automod_violation_log", {
					user: message.author.username,
					user_id: message.author.id,
					user_discriminator: message.author.discriminator,
					filter: "DISALLOWED_CHARSEQUENCE",
					content: message.content,
					channel_id: message.channel.id,
				}),
				""
			);
		}

		if (
			MassMention(string, AutoMod.massMention) &&
			AutoMod.massMention.enabled
		) {
			message.delete();
			await Log.Mod_action(
				client,
				guild,
				Translator.Translate("automod_violation_log", {
					user: message.author.username,
					user_id: message.author.id,
					user_discriminator: message.author.discriminator,
					filter: "MENTION_SPAM",
					content: message.content,
					channel_id: message.channel.id,
				}),
				""
			);
		}

		if (
			MentionSpam(client, AutoMod.mentionSpam) &&
			AutoMod.mentionSpam.enabled
		) {
			message.delete();
			await Log.Mod_action(
				client,
				guild,
				Translator.Translate("automod_violation_log", {
					user: message.author.username,
					user_id: message.author.id,
					user_discriminator: message.author.discriminator,
					filter: "MAX_MENTIONS",
					content: message.content,
					channel_id: message.channel.id,
				}),
				""
			);
		}
	},
};

function InviteLinks(string, object) {
	let allowed_invites = object.whiteList;
	for (let i = 0; i < allowed_invites.length; i++) {
		let regex = new RegExp(
			"(http://|https://)?(www.)?(discord.gg|discord.me|discordapp.com/invite|discord.com/invite)/(" +
				allowed_invites[i] +
				")+",
			"gi"
		);
		if (string.match(regex)) {
			return false;
		}
	}
	return string.match(Regex.INVITE_LINK);
}

function BlackListedWords(string, object) {
	let blacklist = object.blacklist;
	for (let i = 0; i < blacklist.length; i++) {
		let regex = new RegExp("(" + blacklist[i] + ")+", "gi");
		if (string.match(regex)) {
			return true;
		}
	}
}

function MassMention(string, object) {
	const mentions = string.match(Regex.USER_MENTION);
	if (mentions === null) return false;
	if (mentions.length >= object.amount) return true;
}

function MentionSpam(client, object) {
	return false;
}
