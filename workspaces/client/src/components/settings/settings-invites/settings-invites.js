import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./settings-invites.css";

@define({ tag: "settings-invites", styles: [main] })
export class SettingsInvites extends Component {

    render() {
        return html`
            <div class="wrapper">

            </div>
        `;
    }
}