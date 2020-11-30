const Log = require("../moderation/log")

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
				`${message.author.username} has violated the \`INVITE\` filter in ${message.channel}: \n**Content:** ${message.content}`,
				""
			);
		}
	},
};
