import { VNode } from "preact"
import { html } from "htm/preact"

import {
    mainBreadcrumbLink,
    mainBreadcrumbList,
    mainBreadcrumbSeparator,
} from "../../../z_vendor/getto-css/preact/layout/app"
import { linky } from "../../../z_vendor/getto-css/preact/design/highlight"

import { siteInfo } from "../../../example/site"
import { icon } from "../../../x_preact/design/icon"

import { MENU_ID } from "../../action_load_menu/x_preact/load_menu"

import { LoadBreadcrumbListResource } from "../resource"

import { BreadcrumbList, BreadcrumbNode } from "../../load_breadcrumb_list/data"
import { MenuCategory, MenuItem } from "../../kernel/data"

export function LoadBreadcrumbListComponent(resource: LoadBreadcrumbListResource): VNode {
    return mainBreadcrumbList(toContent(resource.breadcrumbList.load()))
}

function toContent(breadcrumbList: BreadcrumbList): VNode[] {
    return [top()].concat(breadcrumbList.map((node) => withSeparator(...content(node))))

    function content(node: BreadcrumbNode): [string, VNode] {
        switch (node.type) {
            case "category":
                return [node.category.label, category(node.category)]

            case "item":
                return [node.item.href, item(node.item)]
        }
    }

    function withSeparator(key: string, content: VNode): VNode {
        return html`<span class="noWrap" key=${key}>${SEPARATOR}${content}</span>`
    }
}

function top(): VNode {
    // トップリンク href="#menu" は menu の id="menu" と対応
    // mobile レイアウトで menu の位置に移動
    return mainBreadcrumbLink(`#${MENU_ID}`, html`${icon("menu-alt-3")} ${siteInfo().title}`)
}
function category({ label }: MenuCategory): VNode {
    return linky(label)
}
function item({ label, icon, href }: MenuItem): VNode {
    const content = html`<i class="${icon}"></i> ${label}`
    return mainBreadcrumbLink(href, content)
}

const SEPARATOR = mainBreadcrumbSeparator(icon("chevron-right"))
