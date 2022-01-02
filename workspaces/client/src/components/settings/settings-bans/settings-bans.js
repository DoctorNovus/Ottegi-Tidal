import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./settings-bans.css";

@define({ tag: "settings-bans", styles: [main] })
export class SettingsBans extends Component {

    render() {
        return html`
            <div class="wrapper">

            </div>
        `;
    }
}