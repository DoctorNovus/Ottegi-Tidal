import { AuthManager } from "./AuthManager";

export class InfoManager {
    static mainUser = "";
    static mainUserObj = {};

    /**
     * Gets user by ID
     * @param {number} id ID of the user 
     * @returns 
     */
    static async getUser(id) {
        let res = await fetch(`/api/user/${id}`, {
            headers: {
                ...AuthManager.getHeaders()
            }
        });
        let data = await res.json();
        return data;
    }

    /**
     * Sets user by ID to value
     * @param {number} id ID of user
     * @param {Object} value value of user
     */
    static async setUser(id, value) {
        let res = await fetch(`/api/user/${id}`, {
            method: "POST",
            body: JSON.stringify(value),
            headers: {
                "Content-Type": "application/json",
                ...AuthManager.getHeaders()
            }
        });
        let data = await res.json();
        return data;
    }

    /**
     * Gets channel by ID
     * @param {number} serverID server ID
     * @param {number} channelID channel ID
     */
    static async getChannel(serverID, channelID) {
        let res = await fetch(`/api/server/${serverID}/channels/${channelID}`, {
            headers: {
                ...AuthManager.getHeaders()
            }
        });
        let data = await res.json();
        this.activeChannel = data;
        return data;
    }

    /**
     * Gets a server by ID
     * @param {number} id ID of server
     * @returns 
     */
    static async getServer(id) {
        let res = await fetch(`/api/server/${id}`, {
            headers: {
                ...AuthManager.getHeaders()
            }
        });
        let data = await res.json();
        return data;
    }

    /**
     * Gets message by ID in channel
     * @param {number} id message ID
     * @param {number} cID channel ID
     * @returns 
     */
    static async getMessages(id, cID) {
        let res = await fetch(`/api/server/${id}/channels/${cID}/messages`, {
            headers: {
                ...AuthManager.getHeaders()
            }
        });
        let data = await res.json();
        return data;
    }

    /**
     * Deletes a message by ID
     * @param {number} id server ID
     * @param {number} cID channel ID
     * @param {number} mID message ID
     * @returns 
     */
    static async deleteMessages(id, cID, mID) {
        let res = await fetch(`/api/server/${id}/channels/${cID}/messages/${mID}`, {
            method: "delete",
            headers: {
                ...AuthManager.getHeaders()
            }
        });
        let data = await res.json();
        return data;
    }

    /**
     * Creates a category by name
     * @param {string} name Name of category
     * @param {Object} server Object of server with ID as a property
     */
    static async createCategory(name, server) {
        let res = await fetch(`/api/server/${server.id}/channels`, {
            method: "POST",
            headers: {
                ...AuthManager.getHeaders()
            },
            body: JSON.stringify({
                name,
                type: "category"
            })
        });
    }

    /**
     * Creates channel by name
     * @param {string} name name of channel
     * @param {Object} server Server object holding ID
     * @param {string} category name of category
     */
    static async createChannel(name, server, category) {
        let res = await fetch(`/api/server/${server.id}/channels`, {
            method: "POST",
            headers: {
                ...AuthManager.getHeaders()
            },
            body: JSON.stringify({
                name,
                type: "text",
                category: category || "uncategorized"
            })
        })
    }

    /**
     * Creates a server by name
     * @param {string} name name of server
     */
    static async createServer(name) {
        let res = await fetch("/api/server", {
            method: "POST",
            headers: {
                ...AuthManager.getHeaders()
            },
            body: JSON.stringify({
                name,
                owner: InfoManager.mainUser
            })
        });
    }
}