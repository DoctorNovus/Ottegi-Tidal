import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./infinity-loader.css";

@define({ tag: "infinity-loader", styles: [main] })
export class ContextMenu extends Component {

    render() {
        return html `
             <div class="col-3">
                <p>Loading</p>
                <div class="stage">
                    <div class="dot-spin"></div>
                </div>
            </div>
        `;
    }

}