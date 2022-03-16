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
    const queue = this.client.queue.get(message.guild.id).queue;

    if (queue.length <= 0)
      return message.channel.send({
        embed: {
          color: "#E67F22",
          author: {
            name: "|  Cannot shuffle with less than 2 tracks in queue",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });

    if (queue.length >= 3) {
      function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));

          var temp = array[i];

          array[i] = array[j];

          array[j] = temp;
        }
      }

      const queue = this.client.queue.get(message.guild.id).queue;

      shuffleArray(queue);

      message.channel.send({
        embed: {
          color: "#E67F22",
          author: {
            name: "|  Shuffled the queue",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
    } else
      return message.channel.send({
        embed: {
          color: "#E67F22",
          author: {
            name: "|  Cannot shuffle with less than 2 tracks in queue",
            icon_url: message.author.avatarURL({ dynamic: true }),
          },
        },
      });
  }
};
