const { MessageEmbed } = require("discord.js");
const e = require("express");
const { updatemessage } = require('../utils/functions')

class ChocoDispatcher {
    constructor(options) {
        this.client = options.client;
        this.guild = options.guild;
        this.text = options.text;
        this.player = options.player;
        this.msgg = options.msgg;
        this.previous = null;
        this.queue = [];
        this.twentyFourSeven = false;
        this.trackloop = false;
        this.queueloop = false;
        this.nightcore = false;
        this.vaporwave = false;
        this.current = null;
        this._8d = false;
        this.previous = null;

        this.player.on("start", () => {
            if (this.text.id === this.msgg.data.guild.mch) {
                updatemessage(this.client, this.msgg);

            }
            else {
                const embed = new MessageEmbed()

                    .setAuthor(
                        "| Now playing",
                        this.current.info.requester.avatarURL({ dynamic: true })
                    )

                    .setDescription(
                        `[${this.current.info.title}](${this.current.info.uri
                        }) [${this.client.formatDuration(this.current.info.length)}]`
                    )

                    .setColor(this.client.color);

                this.text.send(embed);
            }
            //this.text.send(`Now Playing: **${this.current.info.title}**`)
        });

        this.player.on("end", async () => {
            if (this.text.id === this.msgg.data.guild.mch) {
                updatemessage(this.client, this.msgg);

            }
            this.previous = this.current;
            this.current = null;
            if (this.trackloop) {
                if (this.previous.info.length < 10000) return;
                else {
                    this.queue.push(this.previous);
                    array_move(this.queue, -1);
                }
            } else if (this.queueloop) {
                if (this.previous.info.length < 10000) return;
                else {
                    this.queue.push(this.previous);
                }
            }
            // const x = await this.client.db.get(`247_${this.guild.id}`);
            let x = true;
            if (this.queue.length < 1) {
                this.previous = null;
                this.queue = [];
                this.twentyFourSeven = false;
                this.trackloop = false;
                this.queueloop = false;
                this.nightcore = false;
                this.vaporwave = false;
                this.current = null;
                this._8d = false;
                // if (x)
                //     this.text.send({
                //         embed: {
                //             author: {
                //                 name: `|  Queue is empty.`,
                //                 icon_url: this.client.user.avatarURL({ dynamic: true }),
                //             },
                //             color: this.client.color,
                //         },
                //     });
                // if (x)
                //   await this.client.db.set(
                //     `247vc_${this.guild.id}`,
                //     this.player.voiceConnection.voiceChannelID
                //   );
                await this.destroy();
            } else {
                this.play().catch(async (error) => {
                    this.previous = null;
                    this.queue = [];
                    this.twentyFourSeven = false;
                    this.trackloop = false;
                    this.queueloop = false;
                    this.nightcore = false;
                    this.vaporwave = false;
                    this.current = null;
                    this._8d = false;
                    // this.text.send({
                    //     embed: {
                    //         author: {
                    //             name: `|  Queue is empty.`,
                    //             icon_url: this.client.user.avatarURL({ dynamic: true }),
                    //         },
                    //         color: this.client.color,
                    //     },
                    // });
                    // await this.client.db.set(
                    //   `247vc_${this.guild.id}`,
                    //   this.player.voiceConnection.voiceChannelID
                    // );
                    await this.destroy();
                });
            }
        });

        for (const playerEvent of ["closed", "error", "nodeDisconnect"]) {
            this.player.on(playerEvent, (data) => {
                if (data instanceof Error || data instanceof Object)
                    this.client.logger.error(data);

                this.queue.length = 0;
                this.previous = null;
                this.queue = [];
                this.twentyFourSeven = false;
                this.trackloop = false;
                this.queueloop = false;
                this.nightcore = false;
                this.vaporwave = false;
                this.current = null;
                this._8d = false;
                this.destroy();
            });
        }
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    async play() {
        if (!this.queue.length) return this.destroy();

        this.current = this.queue.shift();

        await this.player.playTrack(this.current.track);
    }

    async clearFilters() {
        this.nightcore = false;
        this.vaporwave = false;
        this._8d = false;
        this.player.voiceConnection.node.send({
            op: "filters",
            guildId: this.guild,
        });
        return this;
    }
    async destroy(reason) {
        this.queue.length = 0;
        this.previous = null;
        this.queue = [];
        this.twentyFourSeven = false;
        this.trackloop = false;
        this.queueloop = false;
        this.nightcore = false;
        this.vaporwave = false;
        this.current = null;
        this._8d = false;
        this.player.disconnect();

        this.client.queue.delete(this.guild.id);
        // this.text.send({
        //     embed: {
        //         author: {
        //             name: `|  Queue is empty.`,
        //             icon_url: this.client.user.avatarURL({ dynamic: true }),
        //         },
        //         color: this.client.color,
        //     },
        // });

        //  this.text.send({embed: {description: '<:9192_random_tick:777220713442443285> Queue has ended.', color: 'black'}}).catch(() => null);
    }
}

function array_move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }

    while (new_index < 0) {
        new_index += arr.length;
    }

    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;

        while (k--) {
            arr.push(undefined);
        }
    }

    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);

    return arr;
}

module.exports = ChocoDispatcher;