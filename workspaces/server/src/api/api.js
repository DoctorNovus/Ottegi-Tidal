import { Routes } from "../routes/index";
import { Sockets } from "../sockets/index";

export class API {
    /**
     * Constructs API singleton
     */
    constructor() {
        if (!API._instance)
            API._instance = this;

        return API._instance;
    }

    /**
     * Gets singleton instance
     */
    static get instance() {
        return API._instance;
    }

    routes = new Routes();
    sockets = new Sockets();

    clients = [];

    /**
     * Sets the database
     * @param {Object} db db definition 
     */
    async setDatabase(db) {
        this.db = db;
    }

    /**
     * Broadcasts to members of a channel by ID
     * @param {Object} message message object with channel
     * @param {Object} path path to send to
     * @param {Object} data message data
     */
    broadcast(message, path, data) {
        for (let client of this.clients) {
            if (client.activeChannel.id == message.channel) {
                if (Array.isArray(data))
                    data = data[0];


                client.socket.emit(path.trim(), data);
            }
        }
    }

    /**
     * Finds client by token
     * @param {string} token Chat-based user token
     */
    findClient(token) {
        return this.clients.find(c => c.token == token);
    }

    /**
     * Adds client to api
     * @param {Object} data client data
     */
    addClient(data) {
        this.clients.push(data);
    }

    /**
     * Handles express request with token checking
     * @param {Object} req express request
     * @param {Object} res express response
     */
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

    /**
     * Handles the socket with token auth
     * @param {Object} io io definition 
     * @param {Object} socket socket object
     */
    async handleSocket(io, socket) {
        this.io = io;
        await this.sockets.handle(this, io, socket);
    }
}