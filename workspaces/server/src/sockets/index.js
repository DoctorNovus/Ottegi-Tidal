import { Auth } from "./auth";
import { Chat } from "./chat";

export class Sockets {
    constructor() {
        // Defines the socket class links
        this.sockets = {
            auth: new Auth(),
            chat: new Chat()
        }

    }

    /**
     * Checks if the url is a valid socket
     * @param {string} url URL of socket
     * @returns 
     */
    isValid(url) {
        if (this.sockets[url])
            return true;

        return false;
    }

    /**
     * Handles the socket while assigning each event listener
     * @param {Object} api Base API class
     * @param {*} io Socket.IO io definition
     * @param {*} socket socket connection
     */
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
        })
    }
}