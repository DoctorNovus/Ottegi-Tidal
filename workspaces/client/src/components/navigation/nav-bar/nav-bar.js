import { Component, html } from "@exalt/core";
import { define } from "@exalt/core/decorators";

import main from "./nav-bar.css";

import "@components/navigation/nav-link";

@define({ tag: "nav-bar", styles: [main] })
export class NavBar extends Component {

    render() {
        return html `
            <div class="navigation">
                <div class="title">
                    <div class="ottegi">
                        <div class="ottegi-title">
                            <p class="p1">o</p>
                            <p class="p2">t</p>
                            <p class="p3 blank">ㅤ</p>
                            <p class="p4">t</p>
                            <p class="p5">e</p>
                            <p class="p6">g</p>
                            <p class="p7 blank">ㅤ</p>
                            <p class="p8">i</p>
                        </div>
                        <div class="ottegi-text">
                            <span class="primary">- Infinite Possiblities..</span>
                            <span class="secondary">live in a world of growth..</span>
                        </div>
                    </div>
                </div>
                <div class="links">
                    <ul>
                        <nav-link title=${localStorage.getItem("token") != null ? "Climb in!" : "Login"} url=${localStorage.getItem("token") != null ? "/app" : "/login"} />
                    </ul>
                </div>
            </div>
        `;
    }

}