const Command = require("../../Structures/Command");
const { MessageEmbed } = require("discord.js");

const Discord = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["q"],

      description: "...",

      category: "Music",

      args: false,
      vc: true,

      sameVc: true,

      playing: true,
    });
  }

  async run(message, args) {
    const msg = message;
    const player = this.client.queue.get(message.guild.id);

    const embed2 = new Discord.MessageEmbed()

      .setColor("#E67F22")

      .setDescription(`Nothing is playing`);

    if (!player) return msg.reply(embed2);

    //if(!args[0] || !isNaN(args[0])){

    const queue = player.queue;

    const embed = new MessageEmbed(); //.setAuthor(`Queue`);

    const multiple = 10;

    const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

    const end = page * multiple;

    const start = end - multiple;

    const tracks = queue.slice(start, end);

    // if (msg.guild.music.current) embed.addField("Now Playing", `[${msg.guild.music.current.info.title}](${msg.guild.music.current.info.uri})`);

    if (!tracks.length) {
      embed.setDescription(
        `:loud_sound: Now playing:\n[${player.current.info.title}](${
          player.current.info.uri
        }) [${this.client.formatDuration(
          player.current.info.length - player.player.position
        )} left]\n\n:loud_sound: Up Next:\n${
          page > 1 ? `page ${page}` : "No other tracks here"
        }`
      );
      embed.setFooter(
        `Page: 1/1 | Tracks: 1 | Total Length: ${this.client.formatDuration(
          player.current.info.length - player.player.position
        )}`
      );
      embed.setColor("#E67F22");
      return msg.reply(embed);
    } else {
      embed.setDescription(
        `:loud_sound: Now playing:\n[${player.current.info.title}](${
          player.current.info.uri
        }) [${this.client.formatDuration(
          player.current.info.length - player.player.position
        )} left]\n\n:loud_sound: Up next:\n${tracks
          .map(
            (track, i) =>
              `${start + ++i} - [${track.info.title}](${
                track.info.uri
              }) [${this.client.formatDuration(track.info.length)}]`
          )
          .join("\n")}`
      );

      const maxPages = Math.ceil(queue.length / multiple);
      embed.setColor("#E67F22");
      embed.setFooter(
        `Page: ${page > maxPages ? maxPages : page}/${maxPages} | Tracks: ${
          queue.length + 1
        } | Total Length: ${this.client.formatDuration(
          queue.reduce((prev, curr) => prev + curr.info.length, 0) +
            (player.current.info.length - player.player.position)
        )}`
      );

      return msg.reply(embed);
    }
  }
};
