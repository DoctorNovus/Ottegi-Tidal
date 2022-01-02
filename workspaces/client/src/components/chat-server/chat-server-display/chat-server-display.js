import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import "@components/chat-server/chat-server-message";
import "@components/context-menu/message-menu";

import main from "./chat-server-display.css";
import { InfoManager } from "@hooks/InfoManager";


@define({ tag: "chat-server-display", styles: [main] })
export class ChatServerDisplay extends Component {

    constructor() {
        super();

        if (!ChatServerDisplay._instance)
            ChatServerDisplay._instance = this;

        return ChatServerDisplay._instance;
    }

    static get instance() {
        return ChatServerDisplay._instance;
    }

    messages = super.reactive([]);
    channel = super.reactive({});
    mm = super.createRef();
    mode = new Event("mode");

    render() {
            return html `
            <div class="display" onclick=${() => this.mm.hide()}>
                <div class="header">${this.channel ? this.channel.name : ""}</div>
                <div class="messages">
                    ${this.messages.map((m, index) => html`<chat-server-message onscroller=${(e) => this.setScroll(e.point)} id=${m.id} oncm=${(e) => this.mm.trigger(e.message, m)} messages=${this.messages} message=${m} index=${index} />`)}
                </div>
            </div>
            <message-menu ref="mm" onmode=${(e) => {this.mode.mode = e.mode; this.mode.message = e.message; this.dispatchEvent(this.mode)}}/>
        `;
    }

    setScroll(mess){
        let disp = this.root.querySelector(".display");
        disp.scrollTop = mess.offset;
        mess.mess.highlight();
    }

    getMessageById(id){
        let mess = [...this.root.querySelectorAll("chat-server-message")];
        mess = mess.find(m => m.props.id == id);
        if(!mess)
            return;

        let root = this.root.querySelector(".display").getBoundingClientRect();
        let mRoot = mess.getBoundingClientRect();
        let offset = mRoot.top - root.top;

        return {
            mess,
            message: mess.getContent(),
            offset
        };
    }

    async setChannel(channel){
        const { server } = this.props;
        this.channel = channel;
        let messages = await InfoManager.getMessages(server.id, channel.id);
        if(messages && messages.length > 0)
            this.messages = messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        else
            this.messages = [{}]
    }

    displayData(data) {
        let mess = this.messages;
        mess.push(data);
        this.messages = mess;
        let display = this.root.querySelector(".display");
        setTimeout(() => {
            if(Math.floor(this.messages.length - display.scrollTop / this.messages.length) <= 6)
                display.scrollTop = display.scrollHeight;
        }, 750);
    }

    editData(data){
        let index = this.messages.findIndex(m => m.id == data.id);
        this.messages[index] = data;
    }

    deleteData(data){
        let index = this.messages.findIndex(m => m.id == data.id);
        if(index >= 0)
            this.messages.splice(index, 1);
    }
}