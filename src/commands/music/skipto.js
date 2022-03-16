const Command = require("../../Structures/Command");

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
    if (isNaN(args[0])) return message.channel.send("Invalid number.");

    if (args[0] === 0)
      return message.channel.send(
        `Cannot skip to a song that is already playing. To skip the current playing song type: \`c!skip\``
      );
    const player = this.client.queue.get(message.guild.id);
    if (
      args[0] > player.queue.length ||
      (args[0] && !player.queue[args[0] - 1])
    )
      return message.channel.send({
        embed: {
          author: {
            name: "|  The queue doesn't have that many tracks",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
          color: "#E67F22",
        },
      });

    const { title } = player.queue[args[0] - 1].info;

    if (args[0] == 1) player.player.stopTrack();

    player.queue.splice(0, args[0] - 1);

    player.player.stopTrack();

    return message.channel.send({
      embed: {
        embed: {
          color: "#E67F22",
          author: {
            name: "|  Skipped to the track",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      },
    });
  }
};
