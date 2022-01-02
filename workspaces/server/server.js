'use strict';

var express = require('express');
var shared = require('shared');
var bcrypt = require('bcrypt');
var discord_js = require('discord.js');
var mongodb = require('mongodb');
var socket_io = require('socket.io');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var bcrypt__default = /*#__PURE__*/_interopDefaultLegacy(bcrypt);

class Route {
    root = "";

    get = {};
    post = {};
    delete = {};

    async handle(api, method, route, parts, db, user, req, res) {
        await this.filter(api, method, route, parts, db, user, req, res);
    }

    async query(route) {
        if (!this.get[route]) {
            Object.keys(this.get);
        }

        return this.get[route];
    }

    filterRoute(route, method, req, res, db, user) {
        let parts = route.split(/\//g);

        let getter = Object.keys(this.get);
        let poster = Object.keys(this.post);
        let deleter = Object.keys(this.delete);

        let handle = async(partion, index) => {
            let indiv = {
                baseUrl: parts.join("/"),
                route: [],
                params: {}
            };

            let dime = partion.split(/\//g);
            if (parts.length == dime.length) {
                dime.forEach(async(dim, ind1, array) => {
                    if (parts[ind1] == dim) {
                        if (Array.isArray(indiv.route))
                            indiv.route.push(parts[ind1]);
                    } else if (dim.startsWith(":")) {
                        dim = dim.substring(1, dim.length);
                        indiv.params[dim] = parts[ind1];
                        if (Array.isArray(indiv.route))
                            indiv.route.push(parts[ind1]);
                    }

                    if (ind1 + 1 == array.length) {
                        if (Array.isArray(indiv.route))
                            indiv.route = indiv.route.join("/");

                        indiv.method = method;

                        switch (method) {
                            case "GET":
                                indiv.exec = this.get[getter[index]];
                                break;

                            case "POST":
                                indiv.exec = this.post[poster[index]];
                                break;

                            case "DELETE":
                                indiv.exec = this.delete[deleter[index]];
                                break;
                        }

                        if (indiv && indiv.exec) {
                            await indiv.exec(req, res, db, user, route, indiv);
                        } else {
                            console.log("UNKNOWN API REQUEST", route);
                        }
                    }
                });
            }
        };

        switch (method.trim()) {
            case "GET":
                getter.forEach(handle);
                break;

            case "POST":
                poster.forEach(handle);
                break;

            case "DELETE":
                deleter.forEach(handle);
                break;

            default:
                console.log(`Unknown Method: ${method}`);
                break;
        }
    }

    async filter(api, method, route, parts, db, user, req, res) {
        this.api = api;

        let full = [route].concat(parts).join("/");
        this.filterRoute(full, method, req, res, db, user);
    }
}

class LoginRoute extends Route {
    root = "login";
    post = {
        "login": async(req, res, db, parts) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let user = JSON.parse(body);
                await db.users.find({ email: user.email }).toArray((err, doc) => {
                    if (doc.length > 0) {
                        let dbUser = doc[0];
                        if (bcrypt__default["default"].compareSync(user.password, dbUser.password)) {
                            res.send({ token: dbUser.token, user: { username: dbUser.username, id: dbUser.id }, message: "Authorized" });
                        } else {
                            res.send({ message: "Unaligned credentials. Please check your email/password again." });
                        }
                    } else {
                        res.send({ message: "Sorry, there is no account matching that email. Please register." });
                    }
                });
            });
        }
    }
}

class RegisterRoute extends Route {
    root = "register";
    post = {
        "register": async(req, res, db, parts) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let user = JSON.parse(body);
                await db.users.find({ email: user.email }).toArray((err, doc) => {
                    if (doc.length == 0) {
                        let enc = bcrypt__default["default"].hashSync(user.password, 12);
                        let token = shared.Utils.createToken(22);

                        db.users.insertOne({
                            id: user.username.toLowerCase(),
                            username: user.username,
                            email: user.email,
                            password: enc,
                            servers: ["01101101011000010110100101101110"],
                            token,
                            createdAt: new Date()
                        });

                        res.send({ message: "Signed up! Please login." });
                    } else {
                        res.send({ message: "There is already a user with that email. Please try again." });
                    }
                });
            });
        }
    }
}

class Server {
    constructor(info) {
        this.id = info.id;
        this.name = info.name;
        this.icon = info.icon;
        this.channels = info.channels || [];
        this.owner = info.owner;
    }
}

class User {
    constructor(info) {
        if (!info)
            return;

        this.id = info.id;
        this.username = info.username;
        this.email = info.email;
        this.servers = info.servers;
        this.icon = info.icon || info.avatar || "";

        return this;
    }
}

class Message {
    static encrypt(message) {
        let mess = {};

        mess.server = message.server.id;
        mess.channel = message.channel.id;
        mess.content = Message.compress(message.content);
        mess.author = message.author.id;
        mess.id = shared.Utils.createToken(28);
        mess.createdAt = message.createdAt;
        if (message.editedAt)
            mess.editedAt = message.editedAt;
        if (message.replyTo)
            mess.replyTo = message.replyTo;

        return mess;
    }

    static compress(content) {
        return content.trim();
    }

    static decompress(content) {
        return content;
    }

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

    static async pass(message, server, channel) {
        let mess = {};

        mess.id = shared.Utils.createToken(28);
        mess.channel = channel.id;
        mess.server = server.id;
        mess.content = Message.compress(message.content);
        mess.author = {
            username: "DID" + message.author.username + "#" + message.author.discriminator,
            avatar: message.author.avatarURL({ dynamic: true })
        };

        mess.createdAt = new Date(message.createdTimestamp);

        return mess;
    }

}

class ServerRoute extends Route {
    root = "server";

    get = {
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
            });
        }
    }

    post = {
        "server/:id": async(req, res, db, user, parts, func) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let server = JSON.parse(body);
                server.channels.forEach(channel => { if (channel.channels) channel.channels = null; });
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

    async createID(db, callback) {
        let id = shared.Utils.createID(32);

        await db.servers.find({ id }).toArray(async(err, servers) => {
            if (servers.length == 0)
                callback(id);
            else
                callback(await this.createID(db));
        });
    }
}

class UserRoute extends Route {
    root = "user";
    get = {
        "user/:user": async(req, res, db, user, parts, func) => {
            let id = func.params.user;

            // TODO - REPLACE WITH DATABASE;
            await db.users.find({ id }).toArray((err, info) => {
                if (info.length == 0) {
                    res.send({});
                    return;
                }

                let user = new User(info[0]);
                res.send(JSON.stringify(user));
            });
        }
    }
}

class Routes {
    constructor() {
        this.routes = {
            login: new LoginRoute(),
            register: new RegisterRoute(),
            server: new ServerRoute(),
            user: new UserRoute()
        };
    }

    isValid(route) {
        if (this.routes[route])
            return true;

        return false;
    }

    async route(api, method, route, db, user, req, res) {
        let parts = route.split(/\//g);
        let main = parts.shift();

        if (this.isValid(main)) {
            await this.routes[main].handle(api, method, main, parts, db, user, req, res);
        }
    }
}

class Socket {
    branches = {};

    async getPaths() {
        return Object.keys(this.branches);
    }

    async exec(io, path, socket, args) {
        this.io = io;
        this.branches[path](this.api, socket, args);
    }
}

class Auth extends Socket {
    branches = {
        "login": async(api, socket, message) => {
            message = message[0];
            const { token, username, id } = message;
            let use = api.clients.find(c => c.token == token);
            if (use) {
                if (!use.socket)
                    api.clients[api.clients.indexOf(use)].socket = socket;
            } else {
                api.clients.push({ token, username, id, socket });
            }
        }
    }
}

class Chat extends Socket {
    branches = {
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
                        let client = new discord_js.WebhookClient({ id: channel.link.id, token: channel.link.token });
                        client.send({
                            content: message.content,
                            avatarURL: message.author.icon,
                            username: message.author.username
                        });
                    }

                    message = Message.encrypt(message);

                    channel.messages.push(message);

                    const index = server.channels.findIndex((el) => el.id == channel.id);
                    server.channels[index] = channel;

                    await api.db.servers.updateOne({ id: server.id }, { $set: server });
                }
            });
        },
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

class Sockets {
    constructor() {
        this.sockets = {
            auth: new Auth(),
            chat: new Chat()
        };

    }

    isValid(url) {
        if (this.sockets[url])
            return true;

        return false;
    }

    async handle(api, io, socket) {
        Object.keys(this.sockets).forEach(async(sockete) => {
            sockete = this.sockets[sockete];
            for (let path of await sockete.getPaths()) {
                sockete.api = api;

                socket.on(path, async(...args) => {
                    let token = args[0].token;
                    if (!token || token.trim() == "") {
                        return;
                    }

                    await sockete.exec(io, path, socket, args);
                });
            }
        });
    }
}

class API {
    constructor() {
        if (!API._instance)
            API._instance = this;

        return API._instance;
    }

    static get instance() {
        return API._instance;
    }

    routes = new Routes();
    sockets = new Sockets();

    clients = [];

    async setDatabase(db) {
        this.db = db;
    }

    broadcast(message, path, data) {
        for (let client of this.clients) {
            if (client.activeChannel.id == message.channel) {
                if (Array.isArray(data))
                    data = data[0];


                client.socket.emit(path.trim(), data);

                console.log('BROADCASTING TO', client.username, "at channel", client.activeChannel.name);
            }
        }
    }

    findClient(token) {
        return this.clients.find(c => c.token == token);
    }

    addClient(data) {
        this.clients.push(data);
    }

    async handleRequest(req, res) {
        const { method, url } = req;
        const route = url.split('/api/')[1].trim();
        let token = req.headers.authorization;

        if (route == "register" || route == "login") {
            await this.routes.route(this, method, route, this.db, null, req, res);
        } else {
            if (!token || token.trim() == "") {
                res.status(401).send({ message: "Invalid Token Provided." });
                return;
            }

            this.db.users.find({ token }).toArray(async(err, doc) => {
                if (doc.length > 0) {
                    let use = this.findClient(token);
                    if (!use)
                        this.addClient({
                            token: doc[0].token,
                            username: doc[0].username,
                            id: doc[0].id
                        });

                    await this.routes.route(this, method, route, this.db, doc, req, res);
                } else {
                    res.status(401).send({ message: "Invalid Token Provided." });
                }
            });
        }
    }

    async handleSocket(io, socket) {
        this.io = io;
        await this.sockets.handle(this, io, socket);
    }
}

class Database {
    url = "mongodb+srv://Hiro:se2Skkl8BFdWb0cd@cluster0.lcayr.mongodb.net/tidal"
    dbName = "tidal";

    constructor() {

    }

    async init() {
        this.client = new mongodb.MongoClient(this.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await this.client.connect();
        this.db = await this.client.db(this.dbName);
        this.users = await this.db.collection("users");
        this.servers = await this.db.collection("servers");
    }
}

class Bot extends discord_js.Client {
    constructor() {
        super({ intents: [discord_js.Intents.FLAGS.GUILDS, discord_js.Intents.FLAGS.GUILD_MESSAGES] });
    }

    async init(api) {
        this.on("ready", () => {
            console.log(`Logged in as ${this.user.tag}!`);
        });

        this.on("messageCreate", async(message) => {
            if (message.author.bot || message.guild.id != "845468001687437352")
                return;

            let server = await api.db.servers.findOne({ id: "01101101011000010110100101101110" });
            server.channels.forEach(async(chan, index) => {
                if (chan.link && (chan.link.channelID == message.channel.id)) {
                    let mess = await Message.pass(message, server, chan);
                    console.log(mess);
                    if (!server.channels[index].messages)
                        server.channels[index].messages = [];

                    server.channels[index].messages.push(mess);
                }
            });

            await api.db.servers.updateOne({ id: "01101101011000010110100101101110" }, { $set: server });
        });
    }
}

const app = express__default["default"]();
const port = 3000;
const api = new API();
const db = new Database();
const bot = new Bot();

(async() => {
    await db.init();

    app.use(express__default["default"].static(`${shared.Utils.GetLocalPath("client")}/dist`));
    await api.setDatabase(db);
    app.get("/api/*", async(req, res) => await api.handleRequest(req, res));
    app.post("/api/*", async(req, res) => await api.handleRequest(req, res));
    app.delete("/api/*", async(req, res) => await api.handleRequest(req, res));
    app.get("*", (req, res) => res.sendFile(`${shared.Utils.GetLocalPath("client")}/dist/index.html`));

    await bot.init(api);
    bot.login("OTI2MTM3NTUwMDczMTA2NDcy.Yc3Szg.NF1t6ItjVQJWKCRc6gdwDEYOTts");

    let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    const io = new socket_io.Server(server, {});
    io.on("connection", async(socket) => {
        await api.handleSocket(io, socket);
        socket.on("disconnect", () => {
            api.clients.splice(api.clients.findIndex(c => c.socket == socket), 1);
        });
    });
})();
