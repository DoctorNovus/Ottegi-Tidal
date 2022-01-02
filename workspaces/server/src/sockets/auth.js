import { Socket } from "./socket";

export class Auth extends Socket {
    branches = {
        /**
         * The login message branch listening for when users login
         * @param {Object} api Base API class
         * @param {Object} socket socket connection
         * @param {Array} message Array of messages, typically only having one message
         */
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