import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./direct-messages.css";

@define({ tag: "direct-messages", styles: [main] })
export class DirectMessages extends Component {

    selected = new Event("selected");

    render() {
        return html `
            <div class="wrapper">
                <div class="nav">
                    <ul>
                        <div class="option" onclick=${() => { this.selected.option = "Home"; this.dispatchEvent(this.selected) }}>
                            <img src="/assets/home.png" />
                            <li>Home</li>
                        </div>
                        <div class="option" onclick=${() => { this.selected.option = "Profile"; this.dispatchEvent(this.selected) }}>
                            <img src="/assets/profile.png" />
                            <li>Profile</li>
                        </div>
                        <div class="option" onclick=${() => { this.selected.option = "Friends"; this.dispatchEvent(this.selected) }}>
                            <img src="/assets/friends.png" />
                            <li>Friends</li>
                        </div>
                    </ul>
                </div>
                <div class="users">

                </div>
            </div>
        `;
    }

}