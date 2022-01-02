import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./nav-link.css";

@define({ tag: "nav-link", styles: [main], shadow: false })
export class NavLink extends Component {

    render({ url, title }) {
        return html `
            <li class="link">
                <a href=${url}>${title}</a>
            </li>
        `;
    }

}