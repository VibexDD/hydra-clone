const { Emoji, MessageReaction, Client, MessageEmbed } = require('discord.js');
const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};
const sastaLoop = new Map()

const { updatemessage, shuffle } = require("../utils/functions")
module.exports = async (client, event) => {
    if (!Object.hasOwnProperty.call(events, event.t)) return;

    const { d: data } = event;
    const user = client.users.cache.get(data.user_id);
    const channel = client.channels.cache.get(data.channel_id);

    const message = await channel.messages.fetch(data.message_id);
    const member = message.guild.members.cache.get(user.id);
    const guilddata = {};
    guilddata.config = client.config;
    const guilddataa = await client.findOrCreateGuild({ id: message.guild.id });
    message.guild.data = guilddata.guild = guilddataa;
    message.data = guilddata;

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.cache.get(emojiKey);
    if (member.id !== client.user.id) {
        if (event.t === 'MESSAGE_REACTION_ADD') {
            if (data.channel_id === guilddata.guild.mch) {
                if ((reaction.emoji.name === '⏯️') || (reaction.emoji.toString() === '⏯️') || (reaction.emoji.id === '⏯️')) {

                    const shoukaku = client.queue.get(message.guild.id);
                    if (!shoukaku) return await reaction.users.remove(user.id);
                    const player = shoukaku.player;
                    if (!player) return await reaction.users.remove(user.id);
                    const current = shoukaku.current;
                    if (!current) return await reaction.users.remove(user.id);
                    const queue = shoukaku.queue;

                    if (player.paused) player.setPaused(false)
                    else if (!player.paused) player.setPaused(true)
                    await reaction.users.remove(user.id);
                    await updatemessage(client, message);
                }
                else if ((reaction.emoji.name === '⏹️') || (reaction.emoji.toString() === '⏹️') || (reaction.emoji.id === '⏹️')) {
                    const shoukaku = client.queue.get(message.guild.id);
                    if (!shoukaku) return await reaction.users.remove(user.id);
                    const player = shoukaku.player;
                    if (!player) return await reaction.users.remove(user.id);
                    const current = shoukaku.current;
                    if (!current) return await reaction.users.remove(user.id);
                    const queue = shoukaku.queue;

                    await shoukaku.destroy();
                    await updatemessage(client, message);
                    await reaction.users.remove(user.id);
                }
                else if ((reaction.emoji.name === '⏭️') || (reaction.emoji.toString() === '⏭️') || (reaction.emoji.id === '⏭️')) {
                    const shoukaku = client.queue.get(message.guild.id);
                    if (!shoukaku) return await reaction.users.remove(user.id);
                    const player = shoukaku.player;
                    if (!player) return await reaction.users.remove(user.id);
                    const current = shoukaku.current;
                    if (!current) return await reaction.users.remove(user.id);
                    const queue = shoukaku.queue;

                    await player.stopTrack();
                    await updatemessage(client, message);
                    await reaction.users.remove(user.id);
                }
                else if ((reaction.emoji.name === '🔄') || (reaction.emoji.toString() === '🔄') || (reaction.emoji.id === '🔄')) {
                    const shoukaku = client.queue.get(message.guild.id);
                    if (!shoukaku) return await reaction.users.remove(user.id);
                    const player = shoukaku.player;
                    if (!player) return await reaction.users.remove(user.id);
                    const current = shoukaku.current;
                    if (!current) return await reaction.users.remove(user.id);
                    const queue = shoukaku.queue;
                    const xd = await sastaLoop.get(message.guild.id)

                    if (xd == null || xd == 0) {
                        sastaLoop.set(message.guild.id, 1)
                        shoukaku.trackloop = true;
                        shoukaku.queueloop = false;
                    }

                    else if (xd == 1) {
                        shoukaku.trackloop = false;
                        shoukaku.queueloop = true;
                        sastaLoop.set(message.guild.id, 2)
                    }

                    else if (xd == 2) {
                        sastaLoop.set(message.guild.id, 0)
                        shoukaku.trackloop = false;
                        shoukaku.queueloop = false;
                    }
                    await updatemessage(client, message);
                    await reaction.users.remove(user.id);
                }
                else if ((reaction.emoji.name === '🔀') || (reaction.emoji.toString() === '🔀') || (reaction.emoji.id === '🔀')) {
                    const shoukaku = client.queue.get(message.guild.id);
                    if (!shoukaku) return await reaction.users.remove(user.id);
                    const player = shoukaku.player;
                    if (!player) return await reaction.users.remove(user.id);
                    const current = shoukaku.current;
                    if (!current) return await reaction.users.remove(user.id);
                    const queue = shoukaku.queue;

                    if (queue.length > 2) {
                        await shuffle(queue)
                        await updatemessage(client, message);
                        await reaction.users.remove(user.id);
                    }
                }

            }
        }
    }
}