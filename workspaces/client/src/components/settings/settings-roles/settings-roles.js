import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./settings-roles.css";

@define({ tag: "settings-roles", styles: [main] })
export class SettingsRoles extends Component {

    render() {
        return html`
            <div class="wrapper">

            </div>
        `;
    }
}