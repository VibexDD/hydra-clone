const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["leave", "dc", "disconnect"],

      description: "...",
      voteOnly: false,
      category: "Music",

      args: false,
      vc: true,

      sameVc: true,

      playing: true,
    });
  }

  async run(message, args) {
    const dispatcher = this.client.queue.get(message.guild.id);
    if (!dispatcher) return;
    dispatcher.queue.length = 0;
    dispatcher.queueloop = false;
    dispatcher.trackloop = false;
    await dispatcher.player.stopTrack();
  }
};
