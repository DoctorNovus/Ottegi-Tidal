import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import { NetworkManager } from "@hooks/NetworkManager";
import { AuthManager } from "../../../hooks/AuthManager";

@define({ tag: "io-machine" })
export class IOMachine extends Component {

    message = new Event("message");
    edited = new Event("edit");
    deleted = new Event("deleted");

    render() {
        return html ``;
    }

    mount() {
        this.network = new NetworkManager(this);
    }

    emit(data) {
        this.message.data = data;
        this.dispatchEvent(this.message);
    }

    edit(data) {
        this.edited.data = data;
        this.dispatchEvent(this.edited);
    }

    send(path, data) {
        if (!AuthManager.token || AuthManager.token == "") {
            window.location = "/login";
            return;
        }

        data.token = AuthManager.token;
        this.network.emit(path, data);
    }

    delete(data) {
        this.deleted.data = data;
        this.dispatchEvent(this.deleted);
    }
}