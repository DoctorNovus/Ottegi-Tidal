import { Utils } from "shared";
import { User } from "./user";

export class Message {
    /**
     * Encrypts a message to store easier in the database
     * @param {Object} message info to encrypt
     * @returns {Object} encrypted message
     */
    static encrypt(message) {
        let mess = {};

        mess.server = message.server.id;
        mess.channel = message.channel.id;
        mess.content = Message.compress(message.content);
        mess.author = message.author.id;
        mess.id = Utils.createToken(28);
        mess.createdAt = message.createdAt;
        if (message.editedAt)
            mess.editedAt = message.editedAt;
        if (message.replyTo)
            mess.replyTo = message.replyTo;

        return mess;
    }

    /**
     * Compresses message content
     * @param {string} content message content
     * @returns {string} compressed content
     */
    static compress(content) {
        return content.trim();
    }

    /**
     * Decompresses message content
     * @param {string} content message content
     * @returns {string} decompressed content
     */
    static decompress(content) {
        return content;
    }

    /**
     * Decrypts message from database
     * @param {Object} message encrypted message info
     * @param {Object} channel channel that message is in
     * @param {Object} server server that message is in
     * @param {Object} db db definition
     * @returns 
     */
    static async decrypt(message, channel, server, db) {
        let mess = {};

        mess.id = message.id;
        mess.server = server;
        mess.channel = channel;
        mess.content = Message.decompress(message.content);

        if (message.author)
            if (message.author.username && message.author.username.startsWith("DID")) {
                let un = message.author.username.split("DID")[1];
                un = `[DISCORD] ${un}`;
                console.log(message.author);
                let info = { username: un, avatar: message.author.avatar };
                mess.author = new User(info);
            } else
                mess.author = new User(await db.users.findOne({ id: message.author }));

        console.log(mess.author);

        mess.createdAt = message.createdAt;
        if (message.editedAt)
            mess.editedAt = message.editedAt;
        if (message.replyTo)
            mess.replyTo = message.replyTo;

        return mess;
    }

    /**
     * Handler for discord messages
     * @param {Object} message message info
     * @param {Object} server server message is in
     * @param {Object} channel channel message is in
     * @returns 
     */
    static async pass(message, server, channel) {
        let mess = {};

        mess.id = Utils.createToken(28);
        mess.channel = channel.id;
        mess.server = server.id;
        mess.content = Message.compress(message.content);
        mess.author = {
            username: "DID" + message.author.username + "#" + message.author.discriminator,
            avatar: message.author.avatarURL({ dynamic: true })
        }

        mess.createdAt = new Date(message.createdTimestamp);

        return mess;
    }

}