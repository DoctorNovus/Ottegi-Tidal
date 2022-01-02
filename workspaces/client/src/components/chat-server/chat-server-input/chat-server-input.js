import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { InfoManager } from "@hooks/InfoManager";

import main from "./chat-server-input.css";

@define({ tag: "chat-server-input", styles: [main] })
export class ChatServerInput extends Component {

    messageInput = super.createRef();
    reply = new Event("reply");
    message = new Event("message");
    edit = new Event("edit");
    channel = super.reactive({});

    mode = super.reactive("");
    mmessage = super.reactive({});

    render() {
            switch (this.mode) {
                case "reply":
                    return html `
                        <div class="inputMech">
                            <span class="reply">You are replying to ${this.mmessage.author.username}'s message</span>
                            <textarea ref="messageInput" type="text" placeholder=${`Message ${this.channel.name}`} onkeydown=${async (e) => {
                                if(e.key == "Enter" && !e.shiftKey){ 
                                    e.preventDefault();
                                    await this.replyTo() 
                                }
                            }}></textarea>
                        </div>
                    `;
                case "quote":
                    return html ``;
                case "edit":
                    return html `
                        <div class="inputMech">
                            <textarea ref="messageInput" type="text" placeholder="Editing message..." onkeydown=${async (e) => {
                            if(e.key == "Enter" && !e.shiftKey){ 
                                e.preventDefault();
                                await this.editMessage() 
                            }
                        }}>${this.mmessage.content}</textarea>
                        </div>
                    `;
                default:
                    return html `
                    <div class="inputMech">
                        <textarea ref="messageInput" type="text" placeholder=${`Message ${this.channel.name}`} onkeydown=${async (e) => {
                            if(e.key == "Enter" && !e.shiftKey){ 
                                e.preventDefault();
                                await this.sendMessage() 
                            }
                        }}></textarea>
                    </div>
                `;
        }
            
    }

    setChannel(channel){
        this.channel = channel;
    }

    setMode(mode, message){
        this.mode = mode;
        this.mmessage = message;
    }

    async sendMessage() {
        let content = this.messageInput;
        let user = await InfoManager.getUser(InfoManager.mainUser);

        this.message.data = {
            server: this.props.selected,
            channel: InfoManager.activeChannel,
            content: content.value,
            author: user,
            createdAt: new Date()
        };

        this.dispatchEvent(this.message);

        content.value = "";

    }

    async replyTo() {
        let content = this.messageInput;
        let user = await InfoManager.getUser(InfoManager.mainUser);

        this.reply.data = {
            replyTo: this.mmessage.id,
            server: this.props.selected,
            channel: InfoManager.activeChannel,
            content: content.value,
            author: user,
            createdAt: new Date()
        };

        this.dispatchEvent(this.reply);

        content.value = "";
        this.mode = "chat";
    }

    async editMessage() {
        let content = this.messageInput;
        let user = await InfoManager.getUser(InfoManager.mainUser);

        this.edit.data = {
            id: this.mmessage.id,
            server: this.props.selected,
            channel: InfoManager.activeChannel,
            content: content.value,
            author: user,
            createdAt: new Date()
        };

        this.dispatchEvent(this.edit);

        content.value = "";
        this.mode = "chat";
    }

}