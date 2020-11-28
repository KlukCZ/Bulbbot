module.exports = {
	Master: async (client, string, guild) => {
		return string;
	},
};

/*
Regex
/ (http:\/\/|https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/ /g
/ (http:\/\/|https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([A-Za-z0-9])+ /g

Invitelinks:

Links:


abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~



https://discord.gg/6gdSVg5a
http://discord.gg/6gdSVg5a
discord.gg/6gdSVg5a
discord.gg/6gdSVg5a
https://discord.com/invite/6gdSVg5a
https://discordapp.com/invite/6gdSVg5a
http://discordapp.com/invite/6gdSVg5a
http://discord.com/invite/6gdSVg5a
*/
