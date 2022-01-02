import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./x-button.css";

@define({ tag: "x-button", styles: [main] })
export class XButton extends Component {

    clicked = new Event("close");

    render({ overlay }) {
        return html `
            <div class="button" onclick=${()=> this.dispatchEvent(this.clicked)}>
                <p>x</p>
            </div>
        `;
    }
}