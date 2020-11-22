import {
    packMenuBadgeCount,
    packMenuHref,
    packMenuIcon,
    packMenuLabel,
    unpackMenuBadgeCount,
    unpackMenuPath,
    unpackMenuVersion,
} from "../adapter"
import { unpackApiRoles } from "../../credential/adapter"

import {
    MenuInfra,
    MenuBadge,
    MenuExpand,
    MenuTree,
    MenuTreeNode,
    MenuTreeCategory,
    MenuTreeItem,
} from "../infra"

import { LoadMenu } from "../action"

import { ApiRoles } from "../../credential/data"
import { Menu, MenuNode, MenuPathInfo } from "../data"

export const loadMenu = (infra: MenuInfra): LoadMenu => (collector) => async (post) => {
    const { tree, client } = infra

    const info: MenuInfo = {
        tree,
        menuPathInfo: collector.getMenuPathInfo(),
        apiRoles: await collector.getApiRoles(),
    }

    const expandResponse = await client.expand.getExpand()
    if (!expandResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, EMPTY_EXPAND, EMPTY_BADGE),
            err: expandResponse.err,
        })
        return
    }

    const expand = expandResponse.expand

    // badge の取得には時間がかかる可能性があるのでまず空 badge で返す
    // expand の取得には時間がかからないはずなので expand の取得前には返さない
    post({ type: "succeed-to-load", menu: toMenu(info, expand, EMPTY_BADGE) })

    const badgeResponse = await client.badge.getBadge(await collector.getApiNonce())
    if (!badgeResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, expand, EMPTY_BADGE),
            err: badgeResponse.err,
        })
        return
    }

    const badge = badgeResponse.badge

    post({ type: "succeed-to-load", menu: toMenu(info, expand, badge) })
}

type MenuInfo = Readonly<{
    tree: MenuTree
    menuPathInfo: MenuPathInfo
    apiRoles: ApiRoles
}>

function toMenu({ tree, menuPathInfo, apiRoles }: MenuInfo, expand: MenuExpand, badge: MenuBadge): Menu {
    const version = unpackMenuVersion(menuPathInfo.version)
    const currentPath = unpackMenuPath(menuPathInfo.currentPath)
    const roles = unpackApiRoles(apiRoles)

    // TODO role によってカテゴリを非表示にするんだった
    return tree.flatMap(toMenuNode)

    function toMenuNode(node: MenuTreeNode): MenuNode[] {
        switch (node.type) {
            case "category":
                return menuCategory(node.category, node.children)
            case "item":
                return [menuItem(node.item)]
        }
    }
    function menuCategory(category: MenuTreeCategory, tree: MenuTree): MenuNode[] {
        if (!isAllow()) {
            return []
        }

        const children = tree.flatMap(toMenuNode)
        if (children.length === 0) {
            return []
        }

        const sumBadgeCount = children.reduce((acc, node) => acc + badgeCount(node), 0)

        return [
            {
                type: "category",
                category: {
                    isExpand: expand[category.label] || children.some(isActive),
                    label: packMenuLabel(category.label),
                    badgeCount: packMenuBadgeCount(sumBadgeCount),
                },
                children,
            },
        ]

        function isAllow(): boolean {
            switch (category.permission.type) {
                case "any":
                    return true
                case "role":
                    return roles.includes(category.permission.role)
            }
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
        return {
            type: "item",
            item: {
                isActive: currentPath === item.path,
                label: packMenuLabel(item.label),
                icon: packMenuIcon(item.icon),
                href: packMenuHref(`/${version}/${item.path}`),
                badgeCount: packMenuBadgeCount(badge[item.path] || 0),
            },
        }
    }
}

const EMPTY_EXPAND: MenuExpand = {}
const EMPTY_BADGE: MenuBadge = {}
