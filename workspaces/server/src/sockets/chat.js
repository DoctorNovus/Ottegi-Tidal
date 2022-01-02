import { WebhookClient } from "discord.js";
import { Message } from "../entities/message";
import { Socket } from "./socket";

export class Chat extends Socket {
    branches = {
        /**
         * The chat message branch listening for messages
         * @param {Object} api Base API class
         * @param {Object} socket socket connection
         * @param {Array} message Array of messages, typically only having one message
         */
        "chat message": async(api, socket, message) => {
            message = message[0];

            if (!message && !message && !message.channel)
                return;

            api.db.servers.find({ id: message.server.id }).toArray(async(err, servers) => {
                if (err)
                    console.log(err);

                if (servers.length > 0) {
                    let server = servers[0];
                    let channel = message.channel;
                    if (!channel.messages)
                        channel.messages = [];

                    for (let client of api.clients) {
                        if (client && client.activeChannel && client.activeChannel.id == message.channel.id) {
                            client.socket.emit("chat message", message);
                        }
                    }

                    if (channel.link) {
                        let client = new WebhookClient({ id: channel.link.id, token: channel.link.token });
                        client.send({
                            content: message.content,
                            avatarURL: message.author.icon,
                            username: message.author.username
                        });
                    }
                    1

                    message = Message.encrypt(message);

                    channel.messages.push(message);

                    const index = server.channels.findIndex((el) => el.id == channel.id);
                    server.channels[index] = channel;

                    await api.db.servers.updateOne({ id: server.id }, { $set: server });
                }
            });
        },
        /**
         * The edit message branch listening for edits
         * @param {Object} api Base API class
         * @param {Object} socket socket connection
         * @param {Array} message Array of messages, typically only having one message
         */
        "edit message": async(api, socket, message) => {
            message = message[0];

            if (!message && !message && !message.channel)
                return;

            api.db.servers.find({ id: message.server.id }).toArray(async(err, servers) => {
                if (err)
                    console.log(err);

                if (servers.length > 0) {
                    let server = servers[0];
                    let channel = server.channels.find(c => c.id == message.channel.id);
                    if (!channel.messages)
                        channel.messages = [];

                    for (let client of api.clients) {
                        if (client && client.activeChannel && client.activeChannel.id == message.channel.id) {
                            client.socket.emit("edit message", message);
                        }
                    }

                    let mm = message;

                    let indexer = channel.messages.findIndex(m => m.id == mm.id);
                    message.editedAt = new Date();
                    message = Message.encrypt(message);
                    channel.messages[indexer] = message;

                    const index = server.channels.findIndex((el) => el.id == message.channel);
                    server.channels[index] = channel;

                    await api.db.servers.updateOne({ id: server.id }, { $set: server });
                }
            });
        },
        /**
         * The reply message branch listening for replies
         * @param {Object} api Base API class
         * @param {Object} socket socket connection
         * @param {Array} message Array of messages, typically only having one message
         */
        "reply message": async(api, socket, message) => {
            message = message[0];

            if (!message && !message && !message.channel)
                return;

            api.db.servers.find({ id: message.server.id }).toArray(async(err, servers) => {
                if (err)
                    console.log(err);

                if (servers.length > 0) {
                    let server = servers[0];
                    let channel = message.channel;
                    if (!channel.messages)
                        channel.messages = [];

                    for (let client of api.clients) {
                        if (client && client.activeChannel && client.activeChannel.id == message.channel.id) {
                            client.socket.emit("chat message", message);
                        }
                    }

                    message = Message.encrypt(message);

                    channel.messages.push(message);

                    const index = server.channels.findIndex((el) => el.id == channel.id);
                    server.channels[index] = channel;

                    await api.db.servers.updateOne({ id: server.id }, { $set: server });
                }
            });
        },
    };
}