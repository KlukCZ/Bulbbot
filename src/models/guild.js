const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
	guildID: String,
	guildName: String,
	guildPrefix: String,
	trackAnalytics: Boolean,
	settings: {
		language: String,
		ignoreMissingPerms: Boolean,
	},
	logChannels: {
		modAction: String,
		message: String,
		role: String,
		member: String,
		channel: String,
		automoderation: String,
		join_leave: String,
	},
	roles: {
		mute: String,
	},
	moderationRoles: [
		{
			roleId: String,
			clearanceLevel: Number,
		},
	],
	overrideCommands: [
		{
			commandName: String,
			enabled: Boolean,
			clearanceLevel: Number,
		},
	],
	automoderation: {
		enabled: Boolean,
		massMention: {
			enabled: Boolean,
			amount: Number,
			action: String,
			duration: String,
		},
		mentionSpam: {
			enabled: Boolean,
			amount: Number,
			action: String,
			duration: String,
		},
		tooManyLines: {
			enabled: Boolean,
			amount: Number,
			action: String,
			duration: String,
		},
		tooManyCharacters: {
			enabled: Boolean,
			amount: Number,
			action: String,
			duration: String,
		},
		removeLinks: {
			enabled: Boolean,
			whiteList: Array,
			action: String,
			duration: String,
		},
		removeInviteLinks: {
			enabled: Boolean,
			whiteList: Array,
			action: String,
			duration: String,
		},
		blacklistedWords: {
			enabled: Boolean,
			blacklist: Array,
			action: String,
			duration: String,
		},
	},
	joinDate: Date,
});

module.exports = mongoose.model("Guild", guildSchema);
