import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./message-embed.css";

@define({ tag: "message-embed", styles: [main] })
export class MessageEmbed extends Component {
    data = super.reactive({});

    render() {
        if (!this.data)
            return html ``;

        return html `
            <div class="embed">
                <div class="twrap">
                    <a class="title" href=${this.data.ogUrl}>${this.data.ogTitle}</a>
                </div>
                <div class="dwrap">
                    <p class="description">${this.data.ogDescription}</p>
                </div>
                <div class="pwrap">
                    <img class="preview" src=${this.data.ogImage ? this.data.ogImage.url : ""} />
                </div>
            </div>
        `;
    }

    mount({ url }) {
        let encoded = encodeURIComponent(url);
        fetch(`https://opengraph.io/api/1.1/site/${encoded}`)
            .then(res => res.json())
            .then(res => {
                // console.log(res);
            })
    }
}