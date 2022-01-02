import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";
import { marked } from "marked";

import "@components/message/message-embed";

import main from "./chat-server-message.css";


@define({ tag: "chat-server-message", styles: [main] })
export class ChatServerMessage extends Component {

    messages = super.reactive([]);
    channel = super.reactive({});
    cm = new Event("cm");
    scroller = new Event("scroller");

    render({ messages, message, index }) {
            if (!message || !message.id)
                return html ``;

            let date = new Date(message.createdAt + (1000 * 60 * 5));
            return html `
            <div class="replyWrapper" active=${message.replyTo != null}>
                <span>Replying to <em><span onclick=${() => { this.scroller.point = this.getRootNode().host.getMessageById(message.replyTo) ; this.dispatchEvent(this.scroller) }}>${this.getRootNode().host.getMessageById(message.replyTo) ? this.getRootNode().host.getMessageById(message.replyTo).message.content : ""}</span></em></span>
            </div>
            <div class="message" oncontextmenu=${(e) => { e.preventDefault() ; this.cm.message = e ; this.dispatchEvent(this.cm) }}>
                <div class="user" active=${(messages.length > 1 && messages[index - 1] && messages[index - 1].author && messages[index - 1].author.username == message.author.username && date < new Date()) ? "false" : "true"} >
                    ${(message.author && message.author.icon) ? html`<img src=${message.author.icon} />` : this.showIcon(message.author)}
                </div>
                <div class="content" active=${(messages.length > 1 && messages[index - 1] && messages[index - 1].author && messages[index - 1].author.username == message.author.username && date < new Date()) ? "false" : "true"}>
                    <div class="univ">
                        <p class="user-name">${message.author ? message.author.username : ""}</p>
                        <p class="user-timestamp">${this.formatDate(new Date(message.createdAt))} ${message.editedAt != null ? "(edited)" : ""}</p>
                    </div>
                    <p class="user-text">
                        ${this.parseData(message.content)}
                    </p>
                </div>
            </div>
        `;
    }

    highlight(){
        this.root.querySelector(".message").classList.add("highlight");
        setTimeout(() => {
            this.root.querySelector(".message").classList.remove("highlight");
        }, 1500);
    }

    getContent(){
        return this.props.message;
    }

    parseData(content){
        let cont = marked.parse(content);
        return cont;
    }

    formatDate(d)
    {
        //get the month
        var month = d.getMonth();
        //get the day
        //convert day to string
        var day = d.getDate().toString();
        //get the year
        var year = d.getFullYear();

        var hours = d.getHours();

        var minutes = d.getMinutes();

        var seconds = d.getSeconds();
        
        //pull the last two digits of the year
        year = year.toString().substr(-2);
        
        //increment month by 1 since it is 0 indexed
        //converts month to a string
        month = (month + 1).toString();

        //if month is 1-9 pad right with a 0 for two digits
        if (month.length === 1)
        {
            month = "0" + month;
        }

        //if day is between 1-9 pad right with a 0 for two digits
        if (day.length === 1)
        {
            day = "0" + day;
        }

        //return the string "MMddyy"
        return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`
    }

    showIcon(user) {
        if (!user || !user.username)
            return html `<div class="icon-text" onclick=${()=> 1}>?</div>`;

        let parts = user.username.split(/ /g);
        let icon = "";

        parts.forEach((part) => {
            part = part.split('');
            if (part[0])
                icon += part[0].toUpperCase();
            else
                icon += part;
        });

        return html `<div class="icon-text" onclick=${()=> 1}>${icon}</div>`;
    }
}