import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { unpackBreadcrumbCategory, unpackBreadcrumbItem } from "../../navigation/adapter"

import {
    BreadcrumbComponent,
    BreadcrumbParam,
    initialBreadcrumbState,
    initialBreadcrumbRequest,
} from "../../menu/breadcrumb/component"

import { BreadcrumbList, BreadcrumbCategory, BreadcrumbItem } from "../../navigation/data"

type Props = {
    component: BreadcrumbComponent
    param: BreadcrumbParam
}

export function Breadcrumb(props: Props): VNode {
    const [state, setState] = useState(initialBreadcrumbState)
    const [_request, setRequest] = useState(() => initialBreadcrumbRequest)
    useEffect(() => {
        props.component.onStateChange(setState)

        const resource = props.component.init()
        setRequest(() => resource.request)
        resource.request({ type: "set-param", param: props.param })
        resource.request({ type: "load" })

        return resource.terminate
    }, [])

    switch (state.type) {
        case "initial-breadcrumb":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return content(state.breadcrumbs)

        case "error":
            return error(state.err)
    }
}

function content(breadcrumbs: BreadcrumbList): VNode {
    return html`
        <p class="main__breadcrumb">
            ${breadcrumbList(breadcrumbs)}
        </p>
    `
}
function breadcrumbList(breadcrumbs: BreadcrumbList): VNode[] {
    const flatten = breadcrumbs.flatMap((breadcrumb) => {
        const category = [breadcrumbCategory(breadcrumb.category)]
        const items = breadcrumb.items.map(item => breadcrumbItem(item))
        return category.concat(items)
    })

    // separator で間を埋める
    return flatten.reduce((acc, item) => {
        if (acc.length > 0) {
            acc.push(breadcrumbSeparator)
        }
        acc.push(item)
        return acc
    }, [] as VNode[])
}
function breadcrumbCategory(category: BreadcrumbCategory): VNode {
    return html`<a class="main__breadcrumb__item" href="#menu">${unpackBreadcrumbCategory(category)}</a>`
}
function breadcrumbItem(item: BreadcrumbItem): VNode {
    const data = unpackBreadcrumbItem(item)
    return html`
        <a class="main__breadcrumb__item" href="${data.href}"><i class="${data.icon}"></i> ${data.label}</a>
    `
}
const breadcrumbSeparator: VNode = html`
    <span class="main__breadcrumb__separator"><i class="lnir lnir-chevron-right"></i></span>
`

function error(err: string): VNode {
    return html`
        <div class="notice notice_alert">
            <p>エラーが発生しました(詳細: ${err})</p>
            <div class="vertical vertical_small"></div>
            <small><p>お手数ですが、上記メッセージを管理者にお伝えください</p></small>
        </div>
    `
}

const EMPTY_CONTENT = html``
