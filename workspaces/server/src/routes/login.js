import { Route } from "./route";
import bcrypt from "bcrypt";

export class LoginRoute extends Route {
    root = "login";
    post = {
        /**
         * Listens for login on the post method
         * @param {Object} req express request
         * @param {Object} res express response
         * @param {Object} db db definition
         */
        "login": async(req, res, db) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let user = JSON.parse(body);
                await db.users.find({ email: user.email }).toArray((err, doc) => {
                    if (doc.length > 0) {
                        let dbUser = doc[0];
                        if (bcrypt.compareSync(user.password, dbUser.password)) {
                            res.send({ token: dbUser.token, user: { username: dbUser.username, id: dbUser.id }, message: "Authorized" });
                        } else {
                            res.send({ message: "Unaligned credentials. Please check your email/password again." });
                        }
                    } else {
                        res.send({ message: "Sorry, there is no account matching that email. Please register." });
                    }
                });
            });
        }
    }
}