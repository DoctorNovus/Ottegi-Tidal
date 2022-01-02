import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./home-navigation.css";

import "@components/home/home-nav";
import "@components/home/profile-nav";
import "@components/home/friends-nav";

@define({ tag: "home-navigation", styles: [main] })
export class HomeNavigation extends Component {

    option = super.reactive("Home");

    render() {
        return html `
            <div class="wrapper">
                <div class="banner">
                    <img src="/assets/${this.option.toLowerCase()}.png" />
                    <p>${this.option}</p>
                </div>
                <div class="body">
                    <home-nav active=${this.option.toLowerCase() == "home"} />
                    <profile-nav active=${this.option.toLowerCase() == "profile"} />
                    <friends-nav active=${this.option.toLowerCase() == "friends"} />
                </div>
            </div>>
        `;
    }

    setOption(option) {
        this.option = option;
    }

}