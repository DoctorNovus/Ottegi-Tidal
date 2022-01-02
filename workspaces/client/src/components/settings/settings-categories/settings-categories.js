import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { ChannelManager } from "@hooks/ChannelManager";
import { InfoManager } from "@hooks/InfoManager";

import main from "./settings-categories.css";

@define({ tag: "settings-categories", styles: [main] })
export class SettingsCategories extends Component {

    render({ server }) {
            if (!server)
                return html ``;

            let channels = [];

            if (server && server.channels) {
                channels = ChannelManager.checkChannels(server.channels) ? ChannelManager.sortChannels(server.channels) : ChannelManager.oldBind;
            }

            return html `
                <div class="wrapper" active=${this.props.active}>
                    <div class="title">Categories</div>
                    <div class="categories">
                        ${channels.map(channel => 
                            html`
                                <div class="category">
                                    <input value=${channel.name} />
                                    <ul>
                                        ${channel.channels ? channel.channels.map(chan => html`<li>${chan.name}</li>`) : ""}
                                    </ul>
                                    <button onclick=${async () => await this.createChannel(server, channel.id)}>+</button>
                                </div>
                            `
                        )}
                        <button onclick=${async () => await this.createCategory(server)}>+</button>
                    </div>
                </div>
            `;
    }

    async createCategory(server){
        InfoManager.createCategory("New Category", server);
    }

    async createChannel(server, category){
        InfoManager.createChannel("new-channel", server, category);
    }
}