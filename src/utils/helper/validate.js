const Regex = require("../other/regex");

module.exports = {
	Master: async (client, string, guild) => {
		string = await Remove_Mentions(client, string);
		string = await Remove_Role_Mentions(guild, string);
		string = await Remove_AtEveryone(string);

		return string;
	},
};

async function Remove_Mentions(client, string) {
	let mentions = string.match(Regex.USER_MENTION);

	if (mentions === null) return string;

	for (var i = 0; i < mentions.length; i++) {
		try {
			let user = await client.users.fetch(mentions[i].replace(/\D/g, ``));
			string = string.replace(
				mentions[i],
				`@${user.username}#${user.discriminator}`
			);
		} catch (error) {
			continue;
		}
	}
	return string;
}

async function Remove_Role_Mentions(guild, string) {
	let mentions = string.match(Regex.ROLE_MENTION);

	if (mentions === null) return string;

	for (var i = 0; i < mentions.length; i++) {
		try {
			let role = guild.roles.cache.get(mentions[i].replace(/\D/g, ``));
			string = string.replace(mentions[i], `@${role.name}`);
		} catch (error) {
			continue;
		}
	}
	return string;
}

async function Remove_AtEveryone(string) {
	let mentions = string.match(Regex.ATEVERYONE_ATHERE);

	if (mentions === null) return string;

	for (var i = 0; i < mentions.length; i++) {
		if (mentions[i] === "@here")
			string = string.replace(mentions[i], `@\u04BBere`);
		else string = string.replace(mentions[i], `@\u0435veryone`);
	}

	return string;
}
