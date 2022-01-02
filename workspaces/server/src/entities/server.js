export class Server {
    /**
     * Constructs a message from info
     * @param {Object} info server info
     */
    constructor(info) {
        this.id = info.id;
        this.name = info.name;
        this.icon = info.icon;
        this.channels = info.channels || [];
        this.owner = info.owner;
    }
}