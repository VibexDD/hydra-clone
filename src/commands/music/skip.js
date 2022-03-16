const { MessageAttachment, MessageEmbed } = require("discord.js");
const Command = require("../../Structures/Command");

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      aliases: ["s"],

      description: "...",

      category: "Music",

      args: false,
      vc: true,

      sameVc: true,

      playing: true,
    });
  }

  async run(message, args) {
    const dispatcher = this.client.queue.get(message.guild.id);
    await dispatcher.player.stopTrack();
  }
};
