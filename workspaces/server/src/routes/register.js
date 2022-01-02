import { Route } from "./route";
import { Utils } from "shared";
import bcrypt from "bcrypt";

export class RegisterRoute extends Route {
    root = "register";
    post = {
        /**
         * Listens for register on the post method
         * @param {Object} req express request
         * @param {Object} res express response
         * @param {Object} db db definition
         */
        "register": async(req, res, db) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", async() => {
                let user = JSON.parse(body);
                await db.users.find({ email: user.email }).toArray((err, doc) => {
                    if (doc.length == 0) {
                        let enc = bcrypt.hashSync(user.password, 12);
                        let token = Utils.createToken(22);

                        db.users.insertOne({
                            id: user.username.toLowerCase(),
                            username: user.username,
                            email: user.email,
                            password: enc,
                            servers: ["01101101011000010110100101101110"],
                            token,
                            createdAt: new Date()
                        });

                        res.send({ message: "Signed up! Please login." });
                    } else {
                        res.send({ message: "There is already a user with that email. Please try again." });
                    }
                });
            });
        }
    }
}