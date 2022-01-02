import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

@define({ tag: "register-form" })
export class RegisterForm extends Component {

    username = super.createRef();
    email = super.createRef();
    password = super.createRef();

    render() {
        return html `
            <form onsubmit=${async (e) => {e.preventDefault(); await this.submit(e)}}>
                <label for="username">Username</label>
                <input ref="username" type="text" name="username" placeholder="Enter your username..." />
                <label for="email">Email</label>
                <input ref="email" type="email" name="email" placeholder="Enter your email..." />
                <label for="password">Password</label>
                <input ref="password" type="password" name="password" placeholder="Enter your password..." />
                <button type="submit">Register!</button>
            </form>
        `;
    }

    async submit(e) {
        let res = await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
                username: this.username.value,
                email: this.email.value,
                password: this.password.value
            })
        });

        res = await res.json();

        if (res.message == "Authorized") {
            localStorage.setItem("token", res.token);
            localStorage.setItem("user", res.user.username);
            window.location = "/app";
        }
    }
}