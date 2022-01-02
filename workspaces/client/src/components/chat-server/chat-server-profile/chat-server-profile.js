import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./chat-server-profile.css";

@define({ tag: "chat-server-profile", styles: [main] })
export class ChatServerProfile extends Component {

    render({ user }) {
        if (user && user.icon)
            return html `<div class="wrapper"><img onclick=${()=> 1} alt=${user.username} src=${user.icon} /></div>`;
        else
            return html `<div class="wrapper">${this.showIcon(user)}</div>`;
    }

    showIcon(user) {
        if (!user || !user.username)
            return html `<div class="icon-text" onclick=${()=> 1}>?</div>`;

        let parts = user.username.split(/ /g);
        let icon = "";

        parts.forEach((part) => {
            part = part.split('');
            if (part[0])
                icon += part[0].toUpperCase();
            else
                icon += part;
        });

        return html `<div class="icon-text" onclick=${()=> 1}>${icon}</div>`;
    }
}