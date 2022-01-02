import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@components/login/login-form";

@define("login-home")
export class LoginHome extends Component {

    render() {
        return html `
            <login-form />
        `;
    }
}