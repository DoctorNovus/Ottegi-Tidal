import { Component, html } from "@exalt/core";

export class ContextMenu extends Component {

    hidden = super.reactive(true);
    e = super.reactive({});
    message = super.reactive({});

    getPos(e) {
        let x = e.pageX - 10;
        let y = e.pageY - 10;

        return {
            x,
            y
        }
    }

    trigger(e, m) {
        this.e.target = e;
        this.message = m;
        this.hidden = false;
    }

    hide() {
        this.hidden = true;
    }

    getActive() {
        let pos = { x: 0, y: 0 };
        if (this.e.target)
            pos = this.getPos(this.e.target);

        if (pos.x == 0)
            return false;
        else
            return !this.hidden;
    }

    getStyle() {
        let pos = { x: 0, y: 0 };
        if (this.e.target)
            pos = this.getPos(this.e.target);

        let place = "top";
        if (pos.y >= window.innerHeight / 2) {
            place = "bottom";
            pos.y -= window.innerHeight / 2;
        }

        let place2 = "left";
        if (pos.x >= window.innerWidth / 2) {
            place2 = "right";
            pos.x -= window.innerWidth / 2;
        }

        if (pos.x != 0)
            return `${place}: ${pos.y}px; ${place2}: ${pos.x}px;`;
    }
}