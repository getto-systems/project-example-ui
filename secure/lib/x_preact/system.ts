import { VNode } from "preact"
import { html } from "htm/preact"

export function SystemInfo(): VNode {
    return html`
        <section class="menu__box">
            <dl class="form">
                <dt class="form__header">シーズン</dt>
                <dd class="form__field">
                    ことし
                </dd>
            </dl>
        </section>
    `
}
