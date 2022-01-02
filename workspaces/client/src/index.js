import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@exalt/router";
import "@pages/app-home";
import "@pages/app-null";
import "@pages/chat-home";
import "@pages/login-home";
import "@pages/register-home";

import "./index.css";

@define({ tag: "app-root" })
export class App extends Component {

    render() {
        return html `
            <exalt-router>
                <exalt-route url="/login" component="login-home" />
                <exalt-route url="/register" component="register-home" />
                <exalt-route url="/app" component="chat-home" />
                <exalt-route url="/" component="app-home" />
                <exalt-route component="app-null" />
            </exalt-router>
        `;
    }
}