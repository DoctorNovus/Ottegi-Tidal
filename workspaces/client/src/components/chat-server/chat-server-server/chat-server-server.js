import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./chat-server-server.css";

@define({ tag: "chat-server-server", styles: [main] })
export class ChatServerServer extends Component {

    create = new Event("create");
    selected = new Event("selected");
    icon = super.createRef();

    render({ server }) {
        if (server.icon)
            return html`<img onclick=${()=> this.handleSelect(server)} alt=${server.name} src=${server.icon} />`;
        else
            return this.showIcon(server);
    }

    showIcon(server) {
        if (!server || !server.name)
            return html`<div class="icon-text" onclick=${()=> this.handleSelect(server)}>?</div>`;

        let parts = server.name.split(/ /g);
        let icon = "";

        parts.forEach((part) => {
            part = part.split('');
            if (part[0])
                icon += part[0].toUpperCase();
            else
                icon += part;
        });

        return html`<div class="icon-text" onclick=${()=> this.handleSelect(server)}>${icon}</div>`;
    }

    handleSelect(server) {
        if (!server)
            return;

        if (server.id == "new") {
            this.dispatchEvent(this.create);
        } else {
            this.selected.server = server;
            this.dispatchEvent(this.selected);
        }
    }
}