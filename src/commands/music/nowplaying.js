const Command = require("../../Structures/Command");
const { stripIndents } = require("common-tags");

const moment = require("moment");

require("moment-duration-format")(moment);

const { MessageAttachment, MessageEmbed } = require("discord.js");
module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["np"],
      category: "Music",
    });
  }

  async run(message, args) {
    const bot = this.client;
    if (!message.member.voice.channelID) {
      return message.channel.send({
        embed: {
          color: this.client.colors.crimson,
          author: {
            name: "|  You aren't connected to a voice channel",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    } else if (
      !this.client.queue.get(message.guild.id) ||
      !this.client.queue.get(message.guild.id).current
    ) {
      return message.channel.send({
        embed: {
          color: this.client.colors.crimson,
          author: {
            name: "|  There's nothing playing in this server",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    } else if (
      message.guild.me.voice.channel &&
      !message.guild.me.voice.channel.equals(message.member.voice.channel)
    ) {
      return message.channel.send({
        embed: {
          color: this.client.colors.crimson,
          author: {
            name: "|  You aren't connected to the same voice channel as I am",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    }

    const queue = bot.queue.get(message.guild.id);

    const player = bot.queue.get(message.guild.id).player;

    const currentTime = player.position;

    const trackLength = queue.current.info.length;

    const timeDisplay = `\`${moment
      .duration(currentTime, "milliseconds")
      .format()}/${moment.duration(trackLength, "milliseconds").format()}\``;

    const timeBar = "━".repeat(30).split("");

    for (let i = 0; i < timeBar.length; i++) {

      if (
        i === timeBar.length - 1 ||
        i === Math.round((30 * currentTime) / trackLength)
      ) {
        timeBar.splice(i, 1, "🔘"); 
        break;
      }
    }

    if (!player || !queue.current.info)
      return message.channel.send({
        embed: {
          description: "No song currently playing in this guild",
          color: this.client.color,
        },
      });

    const { title, author, length, thumbnail, requester } = queue.current.info;

    let amount = `${this.client.functions.format(player.position)}`;

    const part = Math.floor((player.position / length) * 10);

    let h;

    let bar;

    if (this.client.functions.format(length) === "Live") {
      h = "Live";

      bar = `🔘━━━━━━━━━━`;

      amount = "00:00";
    } else {
      h = `${this.client.functions.format(length)}`;

      bar = `${
        "[▬](https://www.youtube.com/watch?v=FfEOW8OAJVg)".repeat(part) + "🔘" + "▬".repeat(18 - part)
      }`;
    }

    const embed = new MessageEmbed()
      .setTitle(queue.current.info.title)
      .setDescription(
        stripIndents`
                ~ Requested by ${queue.current.info.requester}\n${bar}\n[${amount} / ${h}]`
      )
      .setColor(this.client.colors.crimson);

    return message.channel
      .send(embed)
      .catch((err) => message.channel.send(err));
  }
};
