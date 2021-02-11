import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    mainBreadcrumbLink,
    mainBreadcrumb,
    mainBreadcrumbSeparator,
} from "../../z_vendor/getto-css/preact/layout/app"

import { useComponent } from "../common/hooks"
import { siteInfo } from "../common/site"
import { icon } from "../common/icon"

import { MENU_ID } from "./MenuList"

import {
    BreadcrumbListComponent,
    initialBreadcrumbListComponentState,
} from "../../auth/x_components/Outline/breadcrumbList/component"

import { Breadcrumb, BreadcrumbNode, MenuCategory, MenuItem } from "../../auth/permission/menu/data"
import { linky } from "../../z_vendor/getto-css/preact/design/highlight"

type Props = Readonly<{
    breadcrumbList: BreadcrumbListComponent
}>
export function BreadcrumbList({ breadcrumbList }: Props): VNode {
    const state = useComponent(breadcrumbList, initialBreadcrumbListComponentState)
    useEffect(() => {
        breadcrumbList.load()
    }, [])

    switch (state.type) {
        case "initial-breadcrumb-list":
            return mainBreadcrumb(EMPTY_CONTENT)

        case "succeed-to-load":
            return content(state.breadcrumb)
    }
}

function content(breadcrumb: Breadcrumb): VNode {
    return mainBreadcrumb(breadcrumbNodes(breadcrumb))
}
function breadcrumbNodes(breadcrumb: Breadcrumb): VNode[] {
    return [breadcrumbTop()].concat(breadcrumb.map((node) => withSeparator(...map(node))))

    function map(node: BreadcrumbNode): [string, VNode] {
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
function breadcrumbCategory({ label }: MenuCategory): VNode {
    return linky(label)
}
function breadcrumbItem({ label, icon, href }: MenuItem): VNode {
    const content = html`<i class="${icon}"></i> ${label}`
    return mainBreadcrumbLink(href, content)
}

function withSeparator(key: string, content: VNode): VNode {
    return html`<span class="noWrap" key=${key}>${SEPARATOR}${content}</span>`
}

const SEPARATOR = mainBreadcrumbSeparator(icon("chevron-right"))

const EMPTY_CONTENT = html``
