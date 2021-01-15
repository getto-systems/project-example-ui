import { VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent, label_alert, label_pending, v_medium, v_small } from "../common/layout"

export function box(title: VNodeContent, content: VNodeContent): VNode {
    return box_content("", title, content)
}
export function box_double(title: VNodeContent, content: VNodeContent): VNode {
    return box_content("box_double", title, content)
}
function box_content(boxClass: string, title: VNodeContent, content: VNodeContent): VNode {
    return html`<section class="box ${boxClass}">
        <div>
            <header class="box__header">
                <h2 class="box__title">${title}</h2>
            </header>
            <section class="box__body paragraph">${content}</section>
        </div>
    </section>`
}

export function itemsSection(title: VNodeContent, list: VNodeContent[]): VNode {
    return html`
        <p>${title}</p>
        ${v_small()} ${items(list)} ${v_medium()}
    `
}
export function items(list: VNodeContent[]): VNode {
    return html`<ul>
        ${list.map(item)}
    </ul>`

    function item(content: VNodeContent): VNode {
        return html`<li>
            <small><i class="lnir lnir-chevron-right"></i></small>
            ${" "} ${content}
        </li>`
    }
}

export function negativeNote(content: VNodeContent, resolve: VNodeContent): VNode {
    return iconSection("lnir lnir-close", content, resolve)
}
export function iconSection(icon: string, content: VNodeContent, note: VNodeContent): VNode {
    return html`
        <p><i class="${icon}"></i> ${content}</p>
        <small><p>${note}</p></small>
        ${v_small()}
    `
}

export function form(title: VNodeContent, content: VNodeContent): VNode {
    return html`
        <dl class="form">
            <dt class="form__header">${title}</dt>
            <dd class="form__field">${content}</dd>
        </dl>
    `
}

export function formWithHelp(title: VNodeContent, content: VNodeContent, help: VNodeContent[]): VNode {
    return form(title, html`${content} ${help.map(toFormHelp)}`)

    function toFormHelp(message: VNodeContent) {
        return html`<p class="form__help">${message}</p>`
    }
}

export function pending(content: VNodeContent): VNode {
    return html`${content} ${label_pending("あとで")}`
}
export function validate(content: VNodeContent): VNode {
    return html`${label_alert("検証")} ${content}`
}
