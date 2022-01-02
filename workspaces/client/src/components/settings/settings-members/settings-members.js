import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./settings-members.css";

@define({ tag: "settings-members", styles: [main] })
export class SettingsMembers extends Component {

    render() {
        return html`
            <div class="wrapper">

            </div>
        `;
    }
}