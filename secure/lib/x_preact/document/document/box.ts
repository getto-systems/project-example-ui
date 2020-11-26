import { VNode } from "preact"
import { html } from "htm/preact"

export function box(title: string, content: VNode): VNode {
    return box_content("", title, content)
}
export function box_double(title: string, content: VNode): VNode {
    return box_content("box_double", title, content)
}
export function box_content(boxClass: string, title: string, content: VNode): VNode {
    return html`<section class="box ${boxClass}">
        <div>
            <header class="box__header">
                <h2 class="box__title">${title}</h2>
            </header>
            <section class="box__body paragraph">${content}</section>
        </div>
    </section>`
}

export function v_small(): VNode {
    return html`<div class="vertical vertical_small"></div>`
}
