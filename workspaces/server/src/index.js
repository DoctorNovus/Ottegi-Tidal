import express from 'express';
import { Utils } from "shared";
import { API } from './api/api';
import { Database } from './db/database';
import { Server as IOServer } from "socket.io";
import { Bot } from './bot/bot';

const app = express();
const port = 3000;
const api = new API();
const db = new Database();
const bot = new Bot();
const config = require("./config.json");

(async() => {
    await db.init();

    app.use(express.static(`${Utils.GetLocalPath("client")}/dist`));
    await api.setDatabase(db);
    app.get("/api/*", async(req, res) => await api.handleRequest(req, res));
    app.post("/api/*", async(req, res) => await api.handleRequest(req, res));
    app.delete("/api/*", async(req, res) => await api.handleRequest(req, res));
    app.get("*", (req, res) => res.sendFile(`${Utils.GetLocalPath("client")}/dist/index.html`))

    await bot.init(api);
    bot.login(config.token);

    let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    const io = new IOServer(server, {});
    io.on("connection", async(socket) => {
        await api.handleSocket(io, socket);
        socket.on("disconnect", () => {
            api.clients.splice(api.clients.findIndex(c => c.socket == socket), 1);
        });
    });
})();