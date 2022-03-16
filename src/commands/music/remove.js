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
    const player = this.client.queue.get(message.guild.id);

    if (isNaN(args[0])) return message.channel.send("Invalid number.");

    if (!args[1]) {
      if (args[0] == 0)
        return message.channel.send(
          `Cannot remove a song that is already playing. To skip the song type: \`m!skip\``
        );

      if (args[0] > player.queue.length)
        return message.channel.send("Song not found.");

      const { title } = player.queue[args[0] - 1].info;

      player.queue.splice(args[0] - 1, 1);

      return message.channel.send({
        embed: {
          color: "#E67F22",
          description: `Removed 1 track from the queue`,
          author: {
            name: "|  Track Removed",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    } else {
      if (args[0] == 0 || args[1] == 0)
        return message.channel.send(
          `Cannot remove a song that is already playing. To skip the song type: \`m!skip\``
        );

      if (args[0] > player.queue.length || args[1] > player.queue.length)
        return message.channel.send("Song not found.");

      if (args[0] > args[1])
        return message.channel.send("Start amount must be bigger than end.");

      const songsToRemove = args[1] - args[0];

      player.queue.splice(args[0] - 1, songsToRemove + 1);

      return message.channel.send({
        embed: {
          author: {
            name: "|  Track Removed",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
          color: "#E67F22",
          description: `Removed **${songsToRemove + 1}** songs from the queue`,
        },
      });
    }
  }
};
