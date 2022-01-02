export class Route {
    root = "";

    get = {};
    post = {};
    delete = {};

    /**
     * Handles the route request
     * @param {Object} api Base API class
     * @param {string} method request method
     * @param {string} route request url
     * @param {Array} parts rest of the route
     * @param {Object} db db definition
     * @param {Object} user user database
     * @param {Object} req express request
     * @param {Object} res express response
     */
    async handle(api, method, route, parts, db, user, req, res) {
        this.api = api;

        let full = [route].concat(parts).join("/");
        this.filterRoute(full, method, req, res, db, user);
    }

    /**
     * Filters the route
     * @param {string} route request url 
     * @param {string} method request method
     * @param {Object} req express request
     * @param {Object} res express response
     * @param {Object} db db definition
     * @param {Object} user user database
     */
    filterRoute(route, method, req, res, db, user) {
        let parts = route.split(/\//g);

        let getter = Object.keys(this.get);
        let poster = Object.keys(this.post);
        let deleter = Object.keys(this.delete);

        let handle = async(partion, index) => {
            let indiv = {
                baseUrl: parts.join("/"),
                route: [],
                params: {}
            };

            let dime = partion.split(/\//g);
            if (parts.length == dime.length) {
                dime.forEach(async(dim, ind1, array) => {
                    if (parts[ind1] == dim) {
                        if (Array.isArray(indiv.route))
                            indiv.route.push(parts[ind1]);
                    } else if (dim.startsWith(":")) {
                        dim = dim.substring(1, dim.length);
                        indiv.params[dim] = parts[ind1];
                        if (Array.isArray(indiv.route))
                            indiv.route.push(parts[ind1]);
                    }

                    if (ind1 + 1 == array.length) {
                        if (Array.isArray(indiv.route))
                            indiv.route = indiv.route.join("/");

                        indiv.method = method;

                        switch (method) {
                            case "GET":
                                indiv.exec = this.get[getter[index]];
                                break;

                            case "POST":
                                indiv.exec = this.post[poster[index]];
                                break;

                            case "DELETE":
                                indiv.exec = this.delete[deleter[index]];
                                break;
                        }

                        if (indiv && indiv.exec) {
                            await indiv.exec(req, res, db, user, route, indiv);
                        } else {
                            console.log("UNKNOWN API REQUEST", route);
                        }
                    }
                });
            }
        };

        // Handles the route based on method
        switch (method.trim()) {
            case "GET":
                getter.forEach(handle);
                break;

            case "POST":
                poster.forEach(handle);
                break;

            case "DELETE":
                deleter.forEach(handle);
                break;

            default:
                console.log(`Unknown Method: ${method}`);
                break;
        }
    }
}