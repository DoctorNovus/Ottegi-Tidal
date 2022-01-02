import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./app-null.css";

import "@components/loaders/infinity-loader";

@define({ tag: "app-null", styles: [main] })
export class AppNull extends Component {

    render() {
        return html `
            <infinity-loader />
        `;
    }
}