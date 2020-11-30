module.exports.USER_MENTION = /<@?!?[0-9>]+/g;
module.exports.USER_MENTION_USER_ID = /<@?!?[0-9>]+|[0-9>]{17,}/g;
module.exports.ROLE_MENTION = /<@&[0-9>]+/g;
module.exports.ATEVERYONE_ATHERE = /@everyone|@here+/g;
