import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { InfoManager } from "@hooks/InfoManager";

import main from "./chat-server-channel.css";

@define({ tag: "chat-server-channel", styles: [main] })
export class ChatServerChannel extends Component {

    selected = new Event("selected");

    render({ channel }) {
        return html `
            <div class="channel" onclick=${async() => { await this.setChannel(channel.id) }}>
                <img class="icon" src=${channel.icon ? channel.icon : "/assets/hashtag.png"} invert=${channel.icon ? false : true } />
                <p class="name">${channel.name}</p>
            </div>
        `
    }

    async setChannel(id) {
        let channel = await InfoManager.getChannel(this.props.server.id, id);
        this.selected.channel = channel;
        this.dispatchEvent(this.selected);
    }
}