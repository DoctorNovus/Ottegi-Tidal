import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@components/chat-server/chat-server-list";
import "@components/chat-server/chat-server-info";
import "@components/chat-server/chat-server-display";
import "@components/chat-server/chat-server-input";
import "@components/chat-server/chat-server-details";
import "@components/chat-server/server-creator";
import "@components/network/io-machine";
import "@components/home/direct-messages";
import "@components/home/home-navigation";

import { AuthManager } from "@hooks/AuthManager";
import { InfoManager } from "@hooks/InfoManager";

import main from "./chat-home.css";

@define({ tag: "chat-home", styles: [main] })
export class ChatHome extends Component {

    creator = super.createRef();
    selected = super.reactive({});
    io = super.createRef();
    display = super.createRef();
    loggedIn = super.reactive(false);
    activeChannel = super.reactive({});
    input = super.createRef();
    homie = super.createRef();

    constructor() {
        super();

        if (!ChatHome._instance)
            ChatHome._instance = this;

        return ChatHome._instance;
    }

    static get instance() {
        return ChatHome._instance;
    }

    render() {
        if (!this.loggedIn)
            return html ``;

        return html `
            <io-machine ref="io" onmessage=${(e) => this.display.displayData(e.data)} onedit=${(e) => this.display.editData(e.data)} ondeleted=${(e) => this.display.deleteData(e.data)} />
            <div class="home" active=${(this.selected && this.selected.id && this.selected.id.trim() != "" && this.selected.id != "home") ? false : true}>
                <chat-server-list onselected=${async (e) => {this.selected = e.server}} oncreate=${(e) => this.creator.show()}/>
                <direct-messages onselected=${(e) => { this.homie.setOption(e.option)}} />
                <home-navigation ref="homie" />
            </div>
            <div class="container" active=${(this.selected && this.selected.id && this.selected.id.trim() != "" && this.selected.id != "home") ? true : false}>
                <chat-server-list onselected=${async (e) => {this.selected = e.server}} oncreate=${(e) => this.creator.show()}/>
                <chat-server-info selected=${this.selected} onselected=${async (e) => { await this.display.setChannel(e.channel); this.input.setChannel(e.channel) }} />
                <div class="messages">
                    <chat-server-display onmode=${(e) => {this.input.setMode(e.mode, e.message)}} server=${this.selected} channel=${this.activeChannel} ref="display" />
                    <chat-server-input channel=${this.activeChannel} ref="input" selected=${this.selected} onmessage=${(e) => this.io.send("chat message", e.data)} onedit=${(e) => this.io.send("edit message", e.data)} onreply=${(e) => this.io.send("reply message", e.data)} />
                </div>
                <chat-server-details />
                <player-profile />
            </div>
            <server-creator ref="creator" />
        `;
    }

    /**
     * Logins the user in and sets loggedIn to true 
     */
    async mount() {
        AuthManager.token = localStorage.getItem("token");
        InfoManager.mainUser = localStorage.getItem("mainUser");
        if (!AuthManager.token || AuthManager.token == "") {
            window.location = "/login";
            return;
        }

        InfoManager.getUser(InfoManager.mainUser).then((user) => {
            InfoManager.mainUserObj = user;
            this.loggedIn = true;
        });
    }
}