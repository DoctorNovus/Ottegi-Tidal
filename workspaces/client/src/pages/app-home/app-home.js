import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./app-home.css";

import "@components/navigation/nav-bar";

@define({ tag: "app-home", styles: [main] })
export class AppHome extends Component {

    render() {
        return html `
            <nav-bar />
            <div class="body">
                
            </div>
        `;
    }
}