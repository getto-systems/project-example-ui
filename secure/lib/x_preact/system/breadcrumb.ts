import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { iconClass } from "../../z_external/icon"

import { unpackMenuLabel, unpackMenuIcon, unpackMenuHref } from "../../menu/adapter"

import { BreadcrumbComponent, initialBreadcrumbState } from "../../system/component/breadcrumb/component"

import { Breadcrumb, BreadcrumbNode, BreadcrumbCategory, BreadcrumbItem } from "../../menu/data"

type Props = Readonly<{
    breadcrumb: BreadcrumbComponent
}>

export function BreadcrumbList({ breadcrumb }: Props): VNode {
    const [state, setState] = useState(initialBreadcrumbState)
    useEffect(() => {
        breadcrumb.onStateChange(setState)
        breadcrumb.load()
    }, [])

    switch (state.type) {
        case "initial-breadcrumb":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return content(state.breadcrumb)
    }
}

function content(breadcrumb: Breadcrumb): VNode {
    return html`<p class="main__breadcrumb">${breadcrumbNodes(breadcrumb)}</p>`
}
function breadcrumbNodes(breadcrumb: Breadcrumb): VNode[] {
    return insertSeparator(breadcrumb.map(toNode))

    function toNode(node: BreadcrumbNode): VNode {
        switch (node.type) {
            case "category":
                return breadcrumbCategory(node.category)

            case "item":
                return breadcrumbItem(node.item)
        }
    }
    function insertSeparator(nodes: VNode[]): VNode[] {
        return nodes.reduce((acc, item) => {
            if (acc.length > 0) {
                acc.push(SEPARATOR)
            }
            acc.push(item)
            return acc
        }, [] as VNode[])
    }
}
function breadcrumbCategory(category: BreadcrumbCategory): VNode {
    const label = unpackMenuLabel(category.label)
    // href="#menu" は menu の id="menu" と対応
    // mobile レイアウトで menu に移動
    return html`<a class="main__breadcrumb__item" href="#menu">${label}</a>`
}
function breadcrumbItem(item: BreadcrumbItem): VNode {
    const label = unpackMenuLabel(item.label)
    const icon = unpackMenuIcon(item.icon)
    const href = unpackMenuHref(item.href)
    const inner = html`<i class="${iconClass(icon)}"></i> ${label}`
    return html`<a class="main__breadcrumb__item" href="${href}">${inner}</a>`
}
const SEPARATOR: VNode = html`
    <span class="main__breadcrumb__separator"><i class="lnir lnir-chevron-right"></i></span>
`

const EMPTY_CONTENT = html``
