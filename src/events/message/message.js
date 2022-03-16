const Event = require("../../Structures/Event");
const rc = require("../../utils/requestcmds");
module.exports = class extends Event {
  async run(message) {
    const data = {};
    const client = this.client;
    data.config = client.config;

    if (message.guild) {
      const guild = await client.findOrCreateGuild({ id: message.guild.id });

      message.guild.data = data.guild = guild;
    }
    message.data = data;

    if (message.channel.id === data.guild.mch) {
      rc(client, message);
    } else {
      const testReg = /^((?:Hey |Ok )?Moosic(?:,|!| ))/i;
      const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);

      const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

      if (message.author.bot) return;

      if (message.content.match(mentionRegex))
        message.channel.send(
          `My prefix for ${message.guild.name} is \`${data.guild.prefix}\`.`
        );

      const prefix = message.content.match(testReg)
        ? message.content.match(testReg)[0]
        : message.content.match(mentionRegexPrefix)
        ? message.content.match(mentionRegexPrefix)[0]
        : data.guild.prefix;

      if (!message.content.startsWith(prefix)) return;

      const [cmd, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);

      const command =
        this.client.commands.get(cmd.toLowerCase()) ||
        this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

      if (command) {
        if (
          command.ownerOnly &&
          !this.client.utils.checkOwner(message.author.id)
        ) {
          return message.reply(
            "Sorry, this command can only be used by the bot owners."
          );
        }

        if (command.guildOnly && !message.guild) {
          return message.reply(
            "Sorry, this command can only be used in a discord server."
          );
        }
        const current = this.client.queue.get(message.guild.id);
        if (command.playing == true && !current)
          return message.channel.send({
            embed: {
              description: "The bot is currently not playing.",
              color: this.client.color.error,
            },
          });
        if (
          command.sameVc &&
          message.member.voice.channelID !== message.guild.me.voice.channelID
        )
          return message.channel.send({
            embed: {
              description:
                "You need to be in the same voice channel as me to use this command.",
              color: this.client.color.error,
            },
          });
        if (command.nsfw && !message.channel.nsfw) {
          return message.reply(
            "Sorry, this command can only be ran in a NSFW marked channel."
          );
        }

        if (command.args && !args.length) {
          return message.reply(
            `Sorry, this command requires arguments to function. Usage: ${
              command.usage
                ? `${this.client.prefix + command.name} ${command.usage}`
                : "This command doesn't have a usage format"
            }`
          );
        }

        if (message.guild) {
          const userPermCheck = command.userPerms
            ? this.client.defaultPerms.add(command.userPerms)
            : this.client.defaultPerms;

          if (userPermCheck) {
            const missing = message.channel
              .permissionsFor(message.member)
              .missing(userPermCheck);

            if (missing.length) {
              return message.reply(
                `You are missing ${this.client.utils.formatArray(
                  missing.map(this.client.utils.formatPerms)
                )} permissions, you need them to use this command!`
              );
            }
          }

          const botPermCheck = command.botPerms
            ? this.client.defaultPerms.add(command.botPerms)
            : this.client.defaultPerms;

          if (botPermCheck) {
            const missing = message.channel
              .permissionsFor(this.client.user)
              .missing(botPermCheck);

            if (missing.length) {
              return message.reply(
                `I am missing ${this.client.utils.formatArray(
                  missing.map(this.client.utils.formatPerms)
                )} permissions, I need them to run this command!`
              );
            }
          }
        }

        this.client.logger.log(
          `${message.author.tag} used ${command.name} command.`,
          "cmd"
        );
        command.run(message, args);
      }
    }
  }
};
