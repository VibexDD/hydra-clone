const Event = require("../Structures/Event");

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      once: true,
    });
  }

  async run() {
    await this.client.lavasfy.requestToken();

    console.log(
      [
        `Logged in as ${this.client.user.tag}`,

        `Loaded ${this.client.commands.size} commands!`,

        `Loaded ${this.client.events.size} events!`,
      ].join("\n")
    );

    const activities = [
      `${this.client.guilds.cache.size} servers!`,

      `${this.client.channels.cache.size} channels!`,

      `${this.client.guilds.cache.reduce(
        (a, b) => a + b.memberCount,
        0
      )} users!`,
    ];

    let i = 0;

    this.client.user.setActivity(`${this.client.prefix}help`, {
      type: "LISTENING",
    });
    this.client.logger.log(this.client.readyAt, "ready");
  }
};
