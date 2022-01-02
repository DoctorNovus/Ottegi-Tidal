import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@components/chat-server/chat-server-server";
import "@components/chat-server/chat-server-profile";

import { InfoManager } from "@hooks/InfoManager";

import main from "./chat-server-list.css";

@define({ tag: "chat-server-list", styles: [main] })
export class ChatServerList extends Component {

    servers = super.reactive([]);
    create = new Event("create");
    selected = new Event("selected");
    user = super.reactive({});

    render() {
            return html `
            <div class="wrapper">
                <div class="profile">
                    <chat-server-profile onclick=${() => { this.selected.server = {id: "home"}; this.dispatchEvent(this.selected)}} user=${this.user} />
                </div>
                <hr class="divider" />
                <div class="servers">
                    ${this.servers.map(server => html`<chat-server-server server=${server} oncreate=${(e)=>
                        { this.dispatchEvent(this.create) }} onselected=${(e) => { this.selected.server = e.server;
                        this.dispatchEvent(this.selected) }}/>`)}
                </div>
            </div>
        `;
    }

    mount() {
        InfoManager.getUser(InfoManager.mainUser).then((user) => {
            this.user = user;

            if (user.servers) {
                let servers = [];
                user.servers.forEach(async (server, index) => {
                    this.trueServer(server).then((server) => {
                        servers.push(server);

                        if (servers.length == user.servers.length){
                            servers.push({ channels: [], id: "new", name: "+" });
                            this.servers = servers;
                        }
                    })
                });
            }
        });
    }

    async trueServer(server) {
        let serve = await InfoManager.getServer(server);
        return serve;
    }
}