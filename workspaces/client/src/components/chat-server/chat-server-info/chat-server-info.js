import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { InfoManager } from "@hooks/InfoManager";
import { ChannelManager } from "@hooks/ChannelManager";

import "@components/page-overlay";
import "@components/x-button";

import "@components/settings/settings-bans";
import "@components/settings/settings-categories";
import "@components/settings/settings-invites";
import "@components/settings/settings-members";
import "@components/settings/settings-overview";
import "@components/settings/settings-roles";

import "@components/chat-server/chat-server-category";

import main from "./chat-server-info.css";

@define({ tag: "chat-server-info", styles: [main] })
export class ChatServerInfo extends Component {

    overlay = super.createRef();

    settingSelected = super.reactive(0);

    channels = [];

    selected = new Event("selected");

    sorted = false;

    render() {
            const { selected } = this.props;
            let channels = [];

            if (selected && selected.channels) {
                channels = ChannelManager.checkChannels(selected.channels) ? ChannelManager.sortChannels(selected.channels) : ChannelManager.oldBind;
            }

            return html `
            <div class="info">
                <div class="header">
                    <p class="title">${selected.name}</p>
                    <img active=${selected.owner == InfoManager.mainUser} onclick=${(e) => { this.overlay.show() }} class="settings-img" src="assets/settings.png" />
                </div>
                <div class="channels">
                    ${channels.map(c => html`
                        <chat-server-category server=${selected} category=${c} onselected=${(e) => { this.selected.channel = e.channel; this.dispatchEvent(this.selected) }} />
                    `)}
                </div>
            </div>
            <page-overlay ref="overlay">
                <div class="settings">
                    <div class="setting-navs">
                        <p class="setting-title">${selected && selected.name ? selected.name.toUpperCase() : ""}</p>
                        <p onclick=${() => this.settingSelected = 0} active=${this.settingSelected == 0}>Overview</p>
                        <p onclick=${() => this.settingSelected = 1} active=${this.settingSelected == 1}>Roles</p>
                        <p onclick=${() => this.settingSelected = 2} active=${this.settingSelected == 2}>Categories</p>
                        <p onclick=${() => this.settingSelected = 3} active=${this.settingSelected == 3}>Invites</p>
                        <p onclick=${() => this.settingSelected = 4} active=${this.settingSelected == 4}>Members</p>
                        <p onclick=${() => this.settingSelected = 5} active=${this.settingSelected == 5}>Bans</p>
                    </div>
                    <div class="setting-menus">
                        <settings-overview server=${selected} active=${this.settingSelected == 0} />
                        <settings-roles server=${selected} active=${this.settingSelected == 1} />
                        <settings-categories server=${selected} active=${this.settingSelected == 2} />
                        <settings-invites server=${selected} active=${this.settingSelected == 3} />
                        <settings-members server=${selected} active=${this.settingSelected == 4} />
                        <settings-bans server=${selected} active=${this.settingSelected == 5} />
                    </div>
                    <x-button onclose=${(e) => this.overlay.hide()} />
                </div>
            </page-overlay>
        `;
    }

    checkChannels(channels){
        let channies = this.channels;

        let checks = 0;
        let val = false;

        for(let chan of channels){
            if(channies.includes(chan.id))
                channies.splice(channies.indexOf(chan.id), 1);    
        }

        if(channies.length == 0){
            checks++;
            val = true;
        }
        
        if(!channels.find(c => c.channels && c.channels.length > 0)){
            checks++;
            val = true;
        }

        if(checks == 0)
            return false;

        return val;
    }

    sortChannels(chans) {
        let channels = [].concat(chans);
        let categories = [{ name: "No Category", id: "uncategorized", channels: [] }].concat(channels.filter(c => c.type == "category").sort((a, b) => a.pos - b.pos));
        let rest = channels.filter(c => c.type != "category").sort((a, b) => a.pos - b.pos);

        let bind = [];

        let channelList = [];

        for (let category of categories) {
            bind.push(category)
        };

        for (let chan of rest) {
            let b = bind.find(c => c.id == chan.category);
            if (b) {
                if (!b.channels)
                    b.channels = [];

                b.channels.push(chan);
                channelList.push(chan.id);
            }
        }

        this.channels = categories.map(c => c.id).concat(channelList);
        bind.checked = true;
        this.oldBind = bind;

        return bind;
    }
}