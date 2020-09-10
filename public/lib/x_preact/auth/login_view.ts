import { VNode } from "preact"
import { html } from "htm/preact"

export function LoginView(content: VNode): VNode {
    return html`
        <aside class="login">
            <section class="login__box">
                <header class="login__header">
                    <cite class="login__brand">GETTO</cite>
                    <strong class="login__title">Example</strong>
                    <cite class="login__subTitle">code templates</cite>
                </header>
                ${content}
            </section>
        </aside>
    `
}
