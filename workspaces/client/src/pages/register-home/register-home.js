import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@components/login/register-form";

@define("register-home")
export class RegisterHome extends Component {

    render() {
        return html`
            <register-form />
        `;
    }
}