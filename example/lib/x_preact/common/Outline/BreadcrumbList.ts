import { VNode } from "preact"
import { html } from "htm/preact"

import {
    mainBreadcrumbLink,
    mainBreadcrumb,
    mainBreadcrumbSeparator,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useApplicationAction } from "../hooks"
import { siteInfo } from "../site"
import { icon } from "../icon"

import { MENU_ID } from "./Menu"

import {
    BreadcrumbListComponent,
    initialBreadcrumbListComponentState,
} from "../../../common/x_Resource/Outline/Menu/BreadcrumbList/component"

import {
    OutlineBreadcrumb,
    OutlineBreadcrumbNode,
    OutlineMenuCategory,
    OutlineMenuItem,
} from "../../../auth/permission/outline/load/data"
import { linky } from "../../../z_vendor/getto-css/preact/design/highlight"

type Props = Readonly<{
    breadcrumbList: BreadcrumbListComponent
}>
export function BreadcrumbList(resource: Props): VNode {
    const state = useApplicationAction(resource.breadcrumbList, initialBreadcrumbListComponentState)

    switch (state.type) {
        case "initial-breadcrumb-list":
            return mainBreadcrumb(EMPTY_CONTENT)

        case "succeed-to-load":
            return content(state.breadcrumb)
    }
}

function content(breadcrumb: OutlineBreadcrumb): VNode {
    return mainBreadcrumb(breadcrumbNodes(breadcrumb))
}
function breadcrumbNodes(breadcrumb: OutlineBreadcrumb): VNode[] {
    return [breadcrumbTop()].concat(breadcrumb.map((node) => withSeparator(...map(node))))

    function map(node: OutlineBreadcrumbNode): [string, VNode] {
        switch (node.type) {
            case "category":
                return [node.category.label, breadcrumbCategory(node.category)]

            case "item":
                return [node.item.href, breadcrumbItem(node.item)]
        }
    }
}
function breadcrumbTop(): VNode {
    // トップリンク href="#menu" は menu の id="menu" と対応
    // mobile レイアウトで menu の位置に移動
    return mainBreadcrumbLink(`#${MENU_ID}`, html`${icon("menu-alt-3")} ${siteInfo().title}`)
}
function breadcrumbCategory({ label }: OutlineMenuCategory): VNode {
    return linky(label)
}
function breadcrumbItem({ label, icon, href }: OutlineMenuItem): VNode {
    const content = html`<i class="${icon}"></i> ${label}`
    return mainBreadcrumbLink(href, content)
}

function withSeparator(key: string, content: VNode): VNode {
    return html`<span class="noWrap" key=${key}>${SEPARATOR}${content}</span>`
}

const SEPARATOR = mainBreadcrumbSeparator(icon("chevron-right"))

const EMPTY_CONTENT = html``
