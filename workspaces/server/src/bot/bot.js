import { Client, Intents } from "discord.js";
import { Message } from "../entities/message";

export class Bot extends Client {
    /**
     * Constructs the intents
     */
    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
    }

    /**
     * Initiates the bot
     * @param {Object} api base API class
     */
    async init(api) {
        this.on("ready", () => {
            console.log(`Logged in as ${this.user.tag}!`);
        });

        this.on("messageCreate", async(message) => {
            // Checks if the message is not a bot and checks if the guild is not the main discord guild
            if (message.author.bot || message.guild.id != api.config.mainGuild)
                return;

            // Finds the server based on chat server ID
            let server = await api.db.servers.findOne({ id: api.config.mainServer });
            server.channels.forEach(async(chan, index) => {
                if (chan.link && (chan.link.channelID == message.channel.id)) {
                    let mess = await Message.pass(message, server, chan);
                    if (!server.channels[index].messages)
                        server.channels[index].messages = [];

                    server.channels[index].messages.push(mess);
                }
            });

            await api.db.servers.updateOne({ id: api.config.mainServer }, { $set: server });
        });
    }
}