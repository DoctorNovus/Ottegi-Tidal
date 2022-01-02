import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./home-nav.css";

@define({ tag: "home-nav", styles: [main] })
export class HomeNav extends Component {

    render() {
        return html `
            <div class="home-nav">
                <h1 class="title">Welcome to OTTEGI</h1>
                <ul class="options">
                    <li>Support us!</li>
                    <li>Give Feedback</li>
                    <li>Find servers</li>
                    <li>Settings</li>
                </ul>
            </div>
        `;
    }

}