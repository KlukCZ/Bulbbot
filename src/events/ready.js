module.exports = (client) => {
	client.user.setPresence({
		status: "online",
		activity: {
			name: `over ${client.guilds.cache.size} guilds`,
			type: "WATCHING",
		},
	});
};
