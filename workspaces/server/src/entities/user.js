export class User {
    /**
     * Constructs a user from user info
     * @param {Object} info user info
     * @returns {User}
     */
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