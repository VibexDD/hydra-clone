const Command = require("../../Structures/Command");
const util = require("../../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: [],

      description: "...",

      category: "Music",
      voteOnly: true,
      args: false,
      vc: true,

      sameVc: true,

      playing: true,
    });
  }

  async run(message, args) {
    const music = this.client.queue.get(message.guild.id);
    const msg = message;
    const duration = args[0];

    if (!duration)
      return msg.channel.send({
        embed: {
          color: "#E67F22",
          description:
            "You must provide duration to seek. Valid duration e.g. `1:34`.",
        },
      });

    if (!durationPattern.test(duration))
      return msg.channel.send({
        embed: {
          color: "#E67F22",
          description:
            "You provided an invalid duration. Valid duration e.g. `1:34`.",
        },
      });

    const durationMs = util.durationToMillis(duration);

    if (durationMs > music.current.info.length)
      return msg.channel.send({
        embed: {
          color: "#E67F22",
          description:
            "The duration you provide exceeds the duration of the current track.",
        },
      });

    try {
      await music.player.seekTo(durationMs);

      msg.reply({
        embed: {
          color: "#E67F22",
          author: {
            name: "| Seeking...",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    } catch (e) {
      msg.channel.send(`An error occured: ${e.message}.`);
    }
  }
};
