const Command = require('../../Structures/Command');
const { MessageEmbed } = require("discord.js");
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {

            aliases: [],
            userPerms: [8],
            category: 'Admin'

        });

    }

    async run(message, args) {
        let data = message.guild.data;
        if (data.requesterOn) {
            data.requesterOn = false;
            await data.markModified("requesterOn")
            await data.save();
            message.channel.send({ embed: { color: 1743798, description: `**__❌ Requester is no longer shown permanently on each track.__**` } })
        }
        else if (!data.requesterOn) {
            data.requesterOn = true;
            await data.markModified("requesterOn")
            await data.save();
            message.channel.send({ embed: { color: 1743798, description: `**__:white_check_mark: Requester will be shown permanently on each track.__**` } })
        }

    }
}