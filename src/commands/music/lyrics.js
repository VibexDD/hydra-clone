const Command = require("../../Structures/Command");
const Discord = require("discord.js");

const lyricsFinder = require("lyrics-finder");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["ly"],

      description: "...",

      category: "Music",
      voteOnly: true,
      args: false,
    });
  }

  async run(message, args) {
    const waitembed = new Discord.MessageEmbed()

      .setDescription("Searching lyrics..")

      .setColor("#E67F22");
    let song = "";
    let lyrics;
    let title = null;
    if (!args[0]) {
      const player = this.client.queue.get(message.guild.id);
      if (!player)
        return message.channel.send(
          "Please provide a song to search for lyrics or play a song."
        );
      else song = player.current.info.title;
    } else {
      song = args.join(" ");
    }
    let waitmsg = await message.channel.send(waitembed).catch(() => {});
    const node = this.client.shoukaku.getNode();
    lyrics = await lyricsFinder(song, "");
    if (lyrics) title = song;
    if (lyrics) {
      const searchData = await node.rest.resolve(song, "youtube");
      if (!searchData || !searchData.tracks.length) return;
      const track = searchData.tracks.shift();
      title = track.info.title;
    }
    if (!lyrics) lyrics = `I was unable to find any lyrics for this search`;

    const embed = new Discord.MessageEmbed()

      .setDescription(lyrics.slice(0, 2000))

      .setColor("#E67F22");
    if (title) embed.setTitle(title);
    await waitmsg.edit(embed).catch(() => {});
  }
};
