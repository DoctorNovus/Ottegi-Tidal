import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { AuthManager } from "@hooks/AuthManager";

import main from "./settings-overview.css";

@define({ tag: "settings-overview", styles: [main] })
export class SettingsOverview extends Component {

    name = super.createRef();

    render({ server }) {
        if (!server)
            return html ``;

        return html `
            <div class="wrapper" active=${this.props.active}>
                <div class="title">Overview</div>
                <div class="profile">
                    <div class="icon">
                        <img src=${server.icon} />
                    </div>
                    <div class="name-edit">
                        <p>Server Name</p>
                        <input ref="name" value=${server.name} oninput=${(e)=> server.name = this.name.value}/>
                    </div>
                </div>
                <div class="info">
                    <p>Server Description</p>
                    <input value=${server.description} placeholder="Enter server description..." />
                </div>
                <div class="system-messages">
                    <p>System Messages Config</p>
                    <div class="sys-config">
                        <p>USER JOINED</p>
                        <input placeholder="User Join Channel Name..." />
                    </div>
                    <div class="sys-config">
                        <p>USER LEFT</p>
                        <input placeholder="User Leave Channel Name..." />
                    </div>
                    <div class="sys-config">
                        <p>USER KICKED</p>
                        <input placeholder="User Kicked Channel Name..." />
                    </div>
                    <div class="sys-config">
                        <p>USER BANNED</p>
                        <input placeholder="User Banned Channel Name..." />
                    </div>
                </div>
                <span onclick=${async ()=> await this.saveServer(server)}>Save</span>
            </div>
        `;
    }

    async saveServer(server) {
        let res = await fetch(`/api/server/${server.id}`, {
            method: "POST",
            headers: {
                ...AuthManager.getHeaders()
            },
            body: JSON.stringify(server)
        });

        res = await res.json();
    }
}