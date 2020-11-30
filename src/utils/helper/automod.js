const Log = require("../moderation/log")
const Translator = require("../lang/translator")

function checkForInvites(string) {
	let allowed_invites = ["allowed_invite", "kluk", "philip"]
	for (let i = 0; i < allowed_invites.length; i++) {
		let regex = new RegExp("(http:\/\/|https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/(" + allowed_invites[i] + ")+", "gi")
		if (string.match(regex)) {
			return false;
		}
	}
 	return string.match(/(http:\/\/|https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([A-Za-z0-9])+/g);
}

function checkForCursing(string) {
	let curse_words = ["nasty_word1", "nasty_word2", "nasty_word3", "nasty_word4"]
	for (let i = 0; i < curse_words.length; i++) {
		let regex = new RegExp("(" + curse_words[i] + ")+", "gi")
		if (string.match(regex)) {
			return true;
		}
	}
}

module.exports = {
	Master: async (client, string, guild, message) => {
		if(checkForInvites(string)) {
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
					channel_id: message.channel.id
				}),
				""
			);
		}

		if (checkForCursing(string)) {
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
					channel_id: message.channel.id
				}),
				""
			);
		}
	},
};
