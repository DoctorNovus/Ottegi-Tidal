import { User } from "../entities/user";
import { Route } from "./route";

export class UserRoute extends Route {
    root = "user";
    get = {
        /**
         * Executes when someone request's a user's info
         */
        "user/:user": async(req, res, db, user, parts, func) => {
            let id = func.params.user;

            // TODO - REPLACE WITH DATABASE;
            await db.users.find({ id }).toArray((err, info) => {
                if (info.length == 0) {
                    res.send({});
                    return;
                }

                let user = new User(info[0]);
                res.send(JSON.stringify(user));
            });
        }
    }
}