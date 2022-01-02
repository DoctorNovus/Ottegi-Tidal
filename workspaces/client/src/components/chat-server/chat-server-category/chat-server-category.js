import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./chat-server-category.css";
import "@components/chat-server/chat-server-channel";

@define({ tag: "chat-server-category", styles: [main] })
export class ChatServerCategory extends Component {

    selected = new Event("selected");
    channelsActive = super.reactive([]);

    render({ server, category }) {
            return html `
                <div class="category">
                    ${category.name == "No Category" ? "" : html`
                        <div onclick=${() => this.toggleHidden(category.id)} class="title">
                            <img class="icon" src=${this.channelsActive.includes(category.id) ? "/assets/arrow_right.png" : "/assets/arrow_down.png"} />
                            <p class="name">${category.name}</p>
                    </div>
                    `}
                    <div class="channels" active=${this.channelsActive.includes(category.id) ? false : true}>
                        ${category.channels ? category.channels.map(cc => html`
                            <chat-server-channel server=${server} channel=${cc} onselected=${async (e) => { this.selected.channel = e.channel; this.dispatchEvent(this.selected) }}>
                        `) : ""}
                    </div>
                </div>
            `
    }

    toggleHidden(channelID){        
        if(this.channelsActive.includes(channelID))
            this.channelsActive.splice(this.channelsActive.indexOf(channelID), 1);
        else
            this.channelsActive.push(channelID);
    }
}