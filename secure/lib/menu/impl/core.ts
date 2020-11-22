import {
    packMenuBadgeCount,
    packMenuHref,
    packMenuIcon,
    packMenuLabel,
    unpackMenuBadgeCount,
} from "../adapter"

import {
    ApiCredentialCollector,
    SearchParamCollector,
    SearchParam,
    MenuInfra,
    MenuInfo,
    MenuBadge,
    MenuTree,
    MenuTreeCategory,
    MenuTreeItem,
    MenuTreeNode,
    MenuExpand,
} from "../infra"

import { LoadMenuAction } from "../action"

import { Menu, MenuNode, LoadMenuEvent } from "../data"

const loadMenu = (
    apiCredential: ApiCredentialCollector,
    searchParam: SearchParamCollector,
    { info, client }: MenuInfra
): LoadMenuAction => async (post: Post<LoadMenuEvent>) => {
    const param = await searchParam()
    const menu = toMenu(info, param, EMPTY_EXPAND, EMPTY_BADGE)

    post({ type: "succeed-to-load", menu })

    const expandResponse = await client.expand.getExpand()
    if (!expandResponse.success) {
        post({ type: "failed-to-load", menu, err: expandResponse.err })
        return
    }

    const badgeResponse = await client.badge.getBadge(await apiCredential())
    if (!badgeResponse.success) {
        post({ type: "failed-to-load", menu, err: badgeResponse.err })
        return
    }

    post({
        type: "succeed-to-load",
        menu: toMenu(info, param, expandResponse.expand, badgeResponse.badge),
    })
}

function toMenu(
    { version, currentPath, tree }: MenuInfo,
    searchParam: SearchParam,
    expand: MenuExpand,
    badge: MenuBadge
): Menu {
    return tree.map(toMenuNode)

    function toMenuNode(node: MenuTreeNode): MenuNode {
        switch (node.type) {
            case "category":
                return menuCategory(node.category, node.children)
            case "item":
                return menuItem(node.item)
        }
    }
    function menuCategory(category: MenuTreeCategory, tree: MenuTree): MenuNode {
        const children = tree.map(toMenuNode)
        const sumBadgeCount = children.reduce((acc, node) => acc + badgeCount(node), 0)

        return {
            type: "category",
            category: {
                isExpand: expand[category.label] || children.some(isActive),
                label: packMenuLabel(category.label),
                badgeCount: packMenuBadgeCount(sumBadgeCount),
            },
            children,
        }

        function badgeCount(node: MenuNode): number {
            switch (node.type) {
                case "category":
                    return unpackMenuBadgeCount(node.category.badgeCount)
                case "item":
                    return unpackMenuBadgeCount(node.item.badgeCount)
            }
        }
        function isActive(node: MenuNode): boolean {
            switch (node.type) {
                case "category":
                    return node.children.some(isActive)
                case "item":
                    return node.item.isActive
            }
        }
    }
    function menuItem(item: MenuTreeItem): MenuNode {
        // TODO searchParam は URL から生成したほうがいいんじゃないかと思う
        const href = `/${version}/${item.path}?${searchParam}`

        return {
            type: "item",
            item: {
                isActive: currentPath === item.path,
                label: packMenuLabel(item.label),
                icon: packMenuIcon(item.icon),
                href: packMenuHref(href),
                badgeCount: packMenuBadgeCount(badge[item.path] || 0),
            },
        }
    }
}

export function initLoadMenuAction(
    apiCredential: ApiCredentialCollector,
    search: SearchParamCollector,
    infra: MenuInfra
): LoadMenuAction {
    return loadMenu(apiCredential, search, infra)
}

const EMPTY_EXPAND: MenuExpand = {}
const EMPTY_BADGE: MenuBadge = {}

interface Post<T> {
    (event: T): void
}
