import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./chat-server-details.css";

@define({ tag: "chat-server-details", styles: [main] })
export class ChatServerDetails extends Component {

    render() {
        return html`
            <div class="details">
                
            </div>
        `;
    }
}