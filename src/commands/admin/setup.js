const Command = require('../../Structures/Command');
const {MessageEmbed} = require("discord.js");
module.exports = class extends Command {

    constructor(...args) {
        super(...args, {

            aliases: [],
            userPerms: [8],
            category: 'Admin'

        });

    }

    async run(message, args) {
        let data = await message.guild.data;
        if (!data) return message.channel.send('Kindly retry i faced some issues while setting up!');
        if (data.mch) {
            if (message.guild.channels.cache.get(data.mch)) return message.channel.send("I already found a music channel!")
        }
        let permissionOverwrites = [{
            id: message.guild.id,
            deny: ['USE_EXTERNAL_EMOJIS', 'ATTACH_FILES', 'ADD_REACTIONS', 'MANAGE_MESSAGES',]
        }]
        let uwumsg = await message.channel.send('Setting up...')
        let channel = await message.guild.channels.create('vibe-song-requests', { type: 'text', permissionOverwrites, reason: 'Music channel for vibe' });
        let setupemb = new MessageEmbed()
        .setImage('https://cdn.discordapp.com/attachments/874529756425625607/885549944122011688/d2b180672154a29561750e6f4147ede3a9fa1735.png')
        .setColor("#9695e0")
        .setTitle("No song playing currently")
        .setDescription('[Invite](https://your.link/) | [Support](https://discord.gg/XndngNV7tx)')
        .setFooter(`Prefix for this server is: ${data.prefix}`)
        await channel.send("https://cdn.discordapp.com/attachments/934104638691622983/951835367680647248/F20DA42F-80E7-4445-9CDC-3EBC0F7606F1.png");
        let setupm = await channel.send(`**__Queue list:__**\nJoin a voice channel and queue songs by name or url in here.`, setupemb);
        await setupm.react('⏯️')
        await setupm.react('⏹️')
        await setupm.react('⏭️')
        await setupm.react('🔄')
        await setupm.react('🔀')
        data.mch = channel.id;
        data.msg = setupm.id;
        data.markModified('mch')
        data.markModified('msg')
        data.save();
        await uwumsg.edit(null, {embed: {
            title: 'Song request channel has been created!',
            color: '#9695e0',
           description: `Channel: ${channel}
            *You can rename and move this channel if you want to.*
            Most of my commands will only work in ${channel} from now on.`
        }})
    }
}