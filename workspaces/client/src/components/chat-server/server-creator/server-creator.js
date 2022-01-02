import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@components/page-overlay";

import { InfoManager } from "@hooks/InfoManager";

import main from "./server-creator.css";

@define({ tag: "server-creator", styles: [main] })
export class ServerCreator extends Component {
    active = super.reactive(false);
    name = super.createRef();

    overlay = super.createRef();

    render() {
        return html`
            <page-overlay centered ref="overlay">
                <div id="formio" active=${this.active}>
                    <form onsubmit=${(e)=> this.createServer(e)}>
                        <label for="sname">Server Name</label>
                        <input type="text" ref="name" name="sname" />
                        <div class="buttons">
                            <button onclick=${(e)=> this.hide()} type="reset">Cancel</button>
                            <button type="submit">Create!</button>
                        </div>
                    </form>
                </div>
            </page-overlay>
        `;
    }

    show() {
        this.overlay.show();
        this.active = true;
    }

    hide() {
        this.overlay.hide();
        this.active = false;
    }

    createServer(e) {
        e.preventDefault();
        InfoManager.createServer(this.name.value);
        this.active = false;
    }
}