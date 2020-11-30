const mongoose = require("mongoose");

const Guild = require("../../models/guild");
const Logger = require("../../utils/other/winston");

module.exports = {
	// Add the guild to the database
	Add: (guildObject) => {
		try {
			const guild = new Guild({
				_id: mongoose.Types.ObjectId(),
				guildID: guildObject.id,
				guildName: guildObject.name,
				guildPrefix: process.env.PREFIX,
				trackAnalytics: true,
				settings: {
					language: "en-us",
					dm_on_action: false,
					allow_non_latin_usernames: false,
				},
				logChannels: {
					modAction: "",
					message: "",
					role: "",
					member: "",
					channel: "",
					automoderation: "",
					join_leave: "",
				},
				roles: {
					mute: "",
				},
				automoderation: {
					enabled: false,
					massMention: {
						enabled: false,
						amount: 0,
						action: "kick",
						duration: null,
					},
					mentionSpam: {
						enabled: false,
						amount: 0,
						action: "kick",
						duration: null,
					},
					tooManyLines: {
						enabled: false,
						amount: 0,
						action: "mute",
						duration: "1h",
					},
					tooManyCharacters: {
						enabled: false,
						amount: 0,
						action: "mute",
						duration: "1h",
					},
					removeLinks: {
						enabled: false,
						whiteList: [],
						action: "mute",
						duration: "10m",
					},
					removeInviteLinks: {
						enabled: false,
						whiteList: [],
						action: "kick",
						duration: null,
					},
					blacklistedWords: {
						enabled: false,
						blacklist: [],
						action: "warn",
						duration: null,
					},
				},
				joinDate: new Date(),
			});
			guild.save().catch((err) => Logger.error(err));

			return true;
		} catch (err) {
			Logger.error(err);
			return false;
		}
	},

	// Remove the entire guild from the database
	Remove: (guildObject) => {
		try {
			Guild.findOneAndDelete(
				{
					guildID: guildObject.id,
				},
				(err, _res) => {
					if (err) Logger.error(err);
				}
			);

			return true;
		} catch (err) {
			Logger.error(err);
			return false;
		}
	},
};
