const Log = require("../utils/moderation/log");
const Translator = require("../utils/lang/translator")

module.exports = async (client, guild, user) => {
    const log = await guild.fetchAuditLogs({limit: 1, type: 'MEMBER_BAN_ADD'});
    const banLog = log.entries.first();
    let { executor, reason } = banLog;
    if (executor.id === client.user.id) return;

    if (reason === null) reason = "No reason given"

    await Log.Mod_action(
        client,
        guild.id,
        Translator.Translate("event_guild_ban_add",
            {
                user: user.username,
                user_discriminator: user.discriminator,
                user_id: user.id,
                moderator: executor.username,
                moderator_discriminator: executor.discriminator,
                moderator_id: executor.id,
                reason: reason
            }),
        ""
    )
}