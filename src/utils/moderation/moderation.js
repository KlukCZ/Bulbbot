const Infraction = require("./infraction");
const mongoose = require("mongoose");
const Mute = require("../../models/mute");
const Tempban = require("../../models/tempban");
const Logger = require("../../utils/other/winston");

const Global = require("../../utils/database//global");

module.exports = {
	Warn: async (_client, guildId, target, moderator, reason) => {
		await Infraction.Add(
			guildId,
			"Warn",
			await GetCurrentInfNumber(),
			target,
			moderator.id,
			reason
		);
		return true;
	},
	// Mutes a user from the guild
	Mute: async (
		_client,
		guildId,
		target,
		moderator,
		reason,
		unixDuration,
		duration
	) => {
		const mute = new Mute({
			_id: mongoose.Types.ObjectId(),
			guildID: guildId,
			targetID: target,
			expireTime: unixDuration,
		});
		mute.save().catch((err) => Logger.error(err));

		await Infraction.Add(
			guildId,
			"Mute",
			await GetCurrentInfNumber(),
			target,
			moderator.id,
			reason + `\n**Duration:** ${duration}`
		);
		return true;
	},
	// Kick user from guild
	Kick: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);
		if (user.kickable) {
			await Infraction.Add(
				guildId,
				"Kick",
				await GetCurrentInfNumber(),
				target,
				moderator.id,
				reason
			);
			await user.kick(
				`Kicked by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`
			);
			return true;
		} else return false;
	},
	// Ban user from guild
	Ban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);

		if (user.bannable) {
			await Infraction.Add(
				guildId,
				"Ban",
				await GetCurrentInfNumber(),
				target,
				moderator.id,
				reason
			);
			await user.ban({
				reason: `Banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});
			return true;
		} else return false;
	},
	// Bans and unbans a user from a guild clearing their messages
	Softban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);
		let user = guild.member(target);

		if (user.bannable) {
			await Infraction.Add(
				guildId,
				"Softban",
				target,
				await GetCurrentInfNumber(),
				moderator.id,
				reason
			);
			await user.ban({
				days: 7,
				reason: `Soft banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});

			await guild.members.unban(
				target,
				`Soft banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target.id} | Reason: ${reason}`
			);
			return true;
		} else return false;
	},
	// Force ban user from guild
	ForceBan: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);

		try {
			await Infraction.Add(
				guildId,
				"Force Ban",
				await GetCurrentInfNumber(),
				target,
				moderator.id,
				reason
			);
			await guild.members.ban(target, {
				reason: `Forced banned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Reason: ${reason}`,
			});
			return true;
		} catch (error) {
			return false;
		}
	},
	// Unban user from guild
	Unban: async (client, guildId, target, moderator, reason) => {
		let guild = client.guilds.cache.get(guildId);

		try {
			await Infraction.Add(
				guildId,
				"Unban",
				target.id,
				await GetCurrentInfNumber(),
				moderator.id,
				reason
			);
			await guild.members.unban(
				target,
				`Unbanned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target.id} | Reason: ${reason}`
			);
			return true;
		} catch (error) {
			return false;
		}
	},

	Tempban: async (
		client,
		guildId,
		target,
		moderator,
		reason,
		duration,
		unixDuration
	) => {
		const guild = client.guilds.cache.get(guildId);
		const user = guild.member(target);

		if (user.bannable) {
			await Infraction.Add(
				guildId,
				"Tempban",
				await GetCurrentInfNumber(),
				target,
				moderator.id,
				`${reason}\n**Duration:** ${duration}`
			);
			await user.ban({
				reason: `Tempbanned by Moderator: ${moderator.username}#${moderator.discriminator} (${moderator.id}) | Target: ${target} | Duration: ${duration} | Reason: ${reason}`,
			});

			const tempban = new Tempban({
				_id: mongoose.Types.ObjectId(),
				guildID: guildId,
				targetID: target,
				expireTime: unixDuration,
			});
			tempban.save().catch((err) => Logger.error(err));

			return true;
		} else return false;
	},
};

function GetCurrentInfNumber() {
	return Global.NumberInfraction();
}
