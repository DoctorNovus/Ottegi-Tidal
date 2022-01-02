export class Socket {
    branches = {};

    /**
     * Gets array of branches on socket
     * @returns 
     */
    async getPaths() {
        return Object.keys(this.branches);
    }

    /**
     * Assignes socket connection and executes the branch
     * @param {Object} io Socket.IO io definition
     * @param {string} path path of branch
     * @param {Object} socket socket connection
     * @param {Array} args additional event listener arguments
     */
    async exec(io, path, socket, args) {
        this.io = io;
        this.branches[path](this.api, socket, args);
    }
}