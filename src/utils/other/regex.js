// Mentions
module.exports.USER_MENTION = /<@?!?[0-9>]+/g;
module.exports.USER_MENTION_USER_ID = /<@?!?[0-9>]+|[0-9>]{17,}/g;
module.exports.ROLE_MENTION = /<@&[0-9>]+/g;
module.exports.ATEVERYONE_ATHERE = /@everyone|@here+/g;

// Links
module.exports.INVITE_LINK = /(http:\/\/|https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([A-Za-z0-9])+/g;

// Other
module.exports.FIND_DIGITS = /\D/g;
