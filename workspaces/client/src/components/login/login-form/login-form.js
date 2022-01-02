import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

@define({ tag: "login-form" })
export class LoginForm extends Component {

    email = super.createRef();
    password = super.createRef();
    status = super.createRef();

    render() {
        return html `
            <form onsubmit=${async (e) => {e.preventDefault(); await this.submit(e)}}>
                <label ref="status"></label>
                <label for="email">Email</label>
                <input ref="email" type="email" name="email" placeholder="Enter your email..." />
                <label for="password">Password</label>
                <input ref="password" type="password" name="password" placeholder="Enter your password..." />
                <button type="submit">Login!</button>
            </form>
        `;
    }

    async submit(e) {
        let res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify({
                email: this.email.value,
                password: this.password.value
            })
        });

        res = await res.json();

        if (res.message == "Authorized") {
            localStorage.setItem("token", res.token);
            localStorage.setItem("mainUser", res.user.username);
            window.location = "/app";
        } else {
            this.status.innerText = res.message;
        }
    }
}