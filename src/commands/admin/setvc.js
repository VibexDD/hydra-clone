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
        let vcss = message.data.guild.vcs;
        if (!args.length) {
            if (!vcss.length) return message.channel.send({ embed: { color: this.client.colors.crimson, description: "There are no restricted voice channels set." } })
            let vcarr = [];
            vcss.forEach(x => {
                if (message.guild.channels.cache.get(x)) vcarr.push(message.guild.channels.cache.get(x).name)
            });
            if (!vcarr.length) return message.channel.send({ embed: { color: this.client.colors.crimson, description: "There are no restricted voice channels set." } })
            let vclist = new MessageEmbed()
                .setTitle("Configured voice channels.")
                .setDescription(`${vcarr.join("\n")}`)
                .setColor(this.client.colors.crimson);
            message.channel.send(vclist)
        }
        else {
            if (args[0].toLowerCase() === 'reset') { }
            else {
                let ch = message.mentions.channels.filter(x => x.type == "voice").first() || message.guild.channels.cache.filter(x => x.type == "voice").get(args[0]) || message.guild.channels.cache.filter(x => x.type == "voice").find(x => x.name.toLowerCase() === args[0].toLowerCase())
                if (!ch) return message.channel.send({ embed: { color: this.client.colors.crimson, description: "Voice channel not found!" } })
                if (vcss.includes(ch.id)) {
                    let index = message.data.guild.vcs.indexOf(`${ch.id}`)
                    message.data.guild.vcs.splice(index, 1)
                    await message.data.guild.markModified('vcs');
                    await message.data.guild.save();
                    message.channel.send({ embed: { color: this.client.colors.crimson, description: `Removed \`${ch.name}\` from the restricted voice channels.` } })
                }
                else {
                    message.data.guild.vcs.push(`${ch.id}`);
                    await message.data.guild.markModified('vcs');
                    await message.data.guild.save();
                    message.channel.send({ embed: { color: this.client.colors.crimson, description: `Added \`${ch.name}\` from the restricted voice channels.` } })

                }
            }
        }

    }
}
