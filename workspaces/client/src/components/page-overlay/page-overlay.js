import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./page-overlay.css";

@define({ tag: "page-overlay", styles: [main] })
export class PageOverlay extends Component {

    active = super.reactive(false);

    render() {
        const { centered = false } = this.props;

        return html`
            <div class="overlay" centered=${centered} active=${this.active}>
                <slot></slot>
            </div>
        `;
    }

    show() {
        this.active = true;
    }

    hide() {
        this.active = false;
    }
}