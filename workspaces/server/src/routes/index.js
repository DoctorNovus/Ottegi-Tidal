import { LoginRoute } from "./login";
import { RegisterRoute } from "./register";
import { ServerRoute } from "./server";
import { UserRoute } from "./user";

export class Routes {
    constructor() {
        // Route paths
        this.routes = {
            login: new LoginRoute(),
            register: new RegisterRoute(),
            server: new ServerRoute(),
            user: new UserRoute()
        }
    }

    /**
     * Checks if the url is a valid route
     * @param {string} url URL of route
     * @returns {boolean} result if valid
     */
    isValid(route) {
        if (this.routes[route])
            return true;

        return false;
    }

    /**
     * route handler
     * @param {Object} api base API class
     * @param {string} method route method
     * @param {string} route request route
     * @param {Object} db Database variable from db initiation
     * @param {Object} user user collection
     * @param {Object} req express request
     * @param {Object} res express response
     */
    async route(api, method, route, db, user, req, res) {
        let parts = route.split(/\//g);
        let main = parts.shift();

        if (this.isValid(main)) {
            await this.routes[main].handle(api, method, main, parts, db, user, req, res);
        }
    }
}