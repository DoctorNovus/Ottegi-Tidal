import io from "socket.io-client";
import { AuthManager } from "./AuthManager";
import { InfoManager } from "./InfoManager";

export class NetworkManager {
    /**
     * Constructs the network manager, using the IO machine and initiates event listeners
     * @param {Element} machine io-machine element
     */
    constructor(machine) {
        this.socket = new io();
        this.machine = machine;

        const { username, id } = InfoManager.mainUserObj;

        this.socket.emit("login", { token: AuthManager.token, username, id });

        this.socket.on("chat message", async(msg) => {
            this.machine.emit(msg);
        });

        this.socket.on("edit message", async(msg) => {
            this.machine.edit(msg);
        })

        this.socket.on("delete message", async(msg) => {
            this.machine.delete(msg);
        });
    }

    /**
     * Sends a message to server
     * @param {string} path path of message
     * @param {Object} data data to emit
     */
    emit(path, data) {
        this.socket.emit(path, data);
    }
}