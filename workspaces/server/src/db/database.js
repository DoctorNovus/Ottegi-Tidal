import { MongoClient } from "mongodb"

export class Database {
    /**
     * Database constructor
     * @param {Object} config Object that holds the url and name of the DB
     */
    constructor(config) {
        this.url = config.url;
        this.dbName = config.dbName;
    }

    /**
     * Initiates the database
     */
    async init() {
        this.client = new MongoClient(this.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await this.client.connect();
        this.db = await this.client.db(this.dbName);
        this.users = await this.db.collection("users");
        this.servers = await this.db.collection("servers");
    }
}