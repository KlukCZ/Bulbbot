module.exports = {
	GetObject: async (client, id) => {
		let emote = await client.shard.broadcastEval(
			`(${findEmoji}).call(this,'${id.replace(/\D/g, "")}')`
		);
		if (emote[0] === null) emote = emote[2];
		else emote = emote[0];

		return emote;
	},
	Full: async (client, id) => {
		let emote = await client.shard.broadcastEval(
			`(${findEmoji}).call(this,'${id.replace(/\D/g, "")}')`
		);
		if (emote[0] === null) emote = emote[2];
		else emote = emote[0];

		return `<:${emote.name}:${emote.id}>`;
	},
	Id: async (client, id) => {
		let emote = await client.shard.broadcastEval(
			`(${findEmoji}).call(this,'${id.replace(/\D/g, "")}')`
		);
		if (emote[0] === null) emote = emote[2];
		else emote = emote[0];

		return emote.id;
	},
};

function findEmoji(id) {
	const temp = this.emojis.cache.get(id);
	if (!temp) return null;

	const emoji = Object.assign({}, temp);
	if (emoji.guild) emoji.guild = emoji.guild.id;
	emoji.require_colons = emoji.requiresColons;

	return emoji;
}
