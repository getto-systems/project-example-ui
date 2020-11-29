import { VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../layout"

export function container(contents: VNodeContent): VNode {
    return html`<section class="container">${contents}</section>`
}

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

export function notice_info(content: VNodeContent): VNode {
    return notice("notice_info", content)
}
function notice(noticeClass: string, content: VNodeContent): VNode {
    return html`<p class="notice ${noticeClass}">${content}</p>`
}

export function itemsSection(title: VNodeContent, list: VNodeContent[]): VNode {
    return html`
        <p>${title}</p>
        ${v_small()} ${items(list)}
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

export function v_small(): VNode {
    return vertical("vertical_small")
}
export function v_medium(): VNode {
    return vertical("vertical_medium")
}
function vertical(verticalClass: string): VNode {
    return html`<div class="vertical ${verticalClass}"></div>`
}
