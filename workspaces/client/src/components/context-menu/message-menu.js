import { html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { InfoManager } from "@hooks/InfoManager";
import { ContextMenu } from "./context-menu";

import main from "./context-menu.css";

@define({ tag: "message-menu", styles: [main] })
export class MessageMenu extends ContextMenu {

    menu = super.createRef();

    mode = new Event("mode");

    render() {
        if (!this.message)
            return;

        return html `
            <div class="menu" active=${this.getActive()} style=${this.getStyle()}>
                <div class="main">
                    <p onclick=${() => this.reply(this.message)}>Reply</p>
                    <p onclick=${() => this.quote(this.message)}>Quote message</p>
                    <p onclick=${() => this.copy(this.message)}>Copy text</p>
                </div>
                <div class="owner" active=${(this.message.author && this.message.author.id == InfoManager.mainUser) ? true : false}>
                    <p onclick=${() => this.edit(this.message)}>Edit message</p>
                    <p class="red" onclick=${() => this.delete(this.message)}>Delete message</p>
                </div>
            </div>
        `;
    }

    reply(message) {
        this.mode.mode = "reply";
        this.mode.message = message;
        this.dispatchEvent(this.mode);
    }

    quote() {

    }

    copy() {

    }

    edit(message) {
        this.mode.mode = "edit";
        this.mode.message = message;
        this.dispatchEvent(this.mode);
    }

    delete(message) {
        InfoManager.deleteMessages(message.server.id, message.channel.id, message.id);
    }
}