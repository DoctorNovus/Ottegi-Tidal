import { Server } from "../entities/server";
import { Route } from "./route";
import { Utils } from "shared";
import { Message } from "../entities/message";
import { API } from "../api/api";

export class ServerRoute extends Route {
    root = "server";

    get = {
        /**
         * Executes when someone requests the server by ID
         */
        "server/:id": async(req, res, db, user, parts, func) => {
            let id = func.params.id;
            await db.servers.find({ id }).toArray((err, servers) => {
                if (err)
                    console.log(err);

                if (servers.length == 0) {
                    res.send({});
                    return;
                }

                let server = new Server(servers[0]);
                res.send(JSON.stringify(server));
            });
        },
        /**
         * Executes when someone requests a channel's messages
         */
        "server/:id/channels/:cid/messages": async(req, res, db, user, parts, func) => {
            let { id, cid } = func.params;
            await db.servers.find({ id }).toArray((err, servers) => {
                if (err)
                    console.log(err);

                if (servers.length == 0) {
                    res.send({});
                    return;
                }

                if (servers[0] && servers[0].channels) {
                    let channel = servers[0].channels.find(c => c.id == cid);
                    if (channel.messages) {
                        let messages = channel.messages.reverse();
                        let nm = [];
                        messages.forEach(async(message, index) => {
                            nm.push(await Message.decrypt(message, channel, servers[0], db));
                            if (nm.length == messages.length) {
                                res.send(JSON.stringify(nm));
                            }
                        });
                    } else
                        res.send({});
                }
            });
        },
        /**
         * Executes when someone requests a message by ID
         */
        "server/:id/channels/:cid/messages/:mID": async(req, res, db, user, parts, func) => {
            let id = func.params.id;
            await db.servers.find({ id }).toArray((err, servers) => {
                if (err)
                    console.log(err);

                if (servers.length == 0) {
                    res.send({});
                    return;
                }

                if (servers[0] && servers[0].messages) {
                    let message = servers[0].messages.find(m => m.id == func.params.mID);
                    if (message)
                        res.send(JSON.stringify(Message.decrypt(message)));
                }
            });
        },
        /**
         * Executes when someone requests a channel by ID
         */
        "server/:serverID/channels/:channelID": async(req, res, db, user, parts, func) => {
            let sID = func.params.serverID;
            let cID = func.params.channelID;

            await db.servers.find({ id: sID }).toArray(async(err, servers) => {
                if (servers.length > 0) {
                    let server = servers[0];

                    if (server) {
                        let chan = server.channels.find(c => c.id == cID);
                        let newUser = this.api.findClient(user[0].token);
                        if (newUser) {
                            if (newUser.socket)
                                newUser.socket.join(chan.id);
                            newUser.activeChannel = chan;
                        }
                        res.send(JSON.stringify(chan));
                    }
                }
            })
        }
    }

    post = {
        /**
         * Executes when someone updates a server by ID
         */
        "server/:id": async(req, res, db, user, parts, func) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let server = JSON.parse(body);
                server.channels.forEach(channel => { if (channel.channels) channel.channels = null });
                let id = func.params.id;

                await db.servers.find({ id }).toArray(async(err, servers) => {
                    if (err)
                        console.log(err);

                    if (servers.length > 0) {
                        let servere = servers[0];

                        if (servere) {
                            await db.servers.updateOne({ id }, { $set: server });
                        }
                    } else {
                        await this.createID(db, async(id) => {
                            server.id = id;
                            server.channels = [];

                            await db.servers.insertOne({...server });

                            await db.users.find({ id: server.owner }).toArray(async(err, users) => {
                                if (users.length > 0) {
                                    let user = users[0];
                                    user.servers.push(id);
                                    await db.users.updateOne({ id: server.owner }, { $set: user });
                                }
                            });
                        });
                    }
                });
            });
        },
        /**
         * Executes when someone updates a server's channels
         */
        "server/:id/channels": async(req, res, db, user, parts, func) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let channel = JSON.parse(body);
                channel.channels = null;
                let id = func.params.id;

                await db.servers.find({ id }).toArray(async(err, servers) => {
                    if (err)
                        console.log(err);

                    if (servers.length > 0) {
                        await this.createID(db, async(id) => {
                            let server = servers[0];

                            if (!server.channels)
                                server.channels = [];

                            channel.id = id;

                            server.channels.push(channel);

                            await db.servers.updateOne({ id: server.id }, { $set: server });
                        });
                    }
                });
            });
        }
    }

    delete = {
        /**
         * Executes when someone deletes a message by ID
         */
        "server/:sid/channels/:cid/messages/:mid": async(req, res, db, user, parts, func) => {
            const { sid, cid, mid } = func.params;
            let server = await db.servers.findOne({ id: sid });
            if (server) {
                let channel = server.channels.find(c => c.id == cid);
                let cIndex = server.channels.indexOf(channel);
                if (channel) {
                    let index = channel.messages.findIndex(m => m.id == mid);
                    if (index > 0) {
                        let message = channel.messages.splice(index, 1)[0];
                        server.channels[cIndex] = channel;
                        this.api.io.emit("delete message", message);
                        await db.servers.updateOne({ id: server.id }, { $set: server });
                    }
                }
            }
        }
    }

    /**
     * Creates the ID based on database
     * @param {Object} db db definition
     * @param {Function} callback callback upon creating ID
     */
    async createID(db, callback) {
        let id = Utils.createID(32);

        await db.servers.find({ id }).toArray(async(err, servers) => {
            if (servers.length == 0)
                callback(id);
            else
                callback(await this.createID(db));
        });
    }
}