import {
    BreadcrumbInfra,
    MenuInfra,
    MenuBadge,
    MenuExpand,
    MenuTree,
    MenuTreeNode,
    MenuTreeCategory,
    MenuTreeItem,
} from "../infra"

import { LoadBreadcrumb, LoadMenu } from "../action"

import { ApiRoles } from "../../credential/data"
import {
    Breadcrumb,
    BreadcrumbNode,
    Menu,
    MenuCategory,
    markMenuCategory,
    MenuItem,
    markMenuItem,
    MenuNode,
    MenuTarget,
} from "../data"

export const loadBreadcrumb = (infra: BreadcrumbInfra): LoadBreadcrumb => (collector) => async (
    post
) => {
    const { tree } = infra

    post({
        type: "succeed-to-load",
        breadcrumb: toBreadcrumb({
            tree,
            menuTarget: collector.getMenuPath(),
        }),
    })
}

type BreadcrumbInfo = Readonly<{
    tree: MenuTree
    menuTarget: MenuTarget
}>

function toBreadcrumb({ tree, menuTarget }: BreadcrumbInfo): Breadcrumb {
    if (!menuTarget.versioned) {
        return []
    }
    const { version, currentPath } = menuTarget

    return treeToBreadcrumb(tree)

    function treeToBreadcrumb(tree: MenuTree): Breadcrumb {
        for (let i = 0; i < tree.length; i++) {
            const breadcrumb = breadcrumbNodes(tree[i])
            if (breadcrumb.length > 0) {
                return breadcrumb
            }
        }
        return EMPTY_BREADCRUMB
    }
    function breadcrumbNodes(node: MenuTreeNode): BreadcrumbNode[] {
        switch (node.type) {
            case "category":
                return breadcrumbCategory(node.category, node.children)
            case "item":
                return breadcrumbItem(node.item)
        }
    }
    function breadcrumbCategory(category: MenuTreeCategory, tree: MenuTree): BreadcrumbNode[] {
        const breadcrumb = treeToBreadcrumb(tree)
        if (breadcrumb.length === 0) {
            return EMPTY_BREADCRUMB
        }
        return [{ type: "category", category: toMenuCategory(category), ...breadcrumb }]
    }
    function breadcrumbItem(item: MenuTreeItem): BreadcrumbNode[] {
        if (item.path !== currentPath) {
            return EMPTY_BREADCRUMB
        }
        return [{ type: "item", item: toMenuItem(item, version) }]
    }
}

export const loadMenu = (infra: MenuInfra): LoadMenu => (collector) => async (nonce, roles, post) => {
    const { tree, client } = infra

    const info: MenuInfo = {
        tree,
        roles,
        menuTarget: collector.getMenuPath(),
    }

    const expandResponse = client.expand.getExpand()
    if (!expandResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, EMPTY_EXPAND, EMPTY_BADGE),
            err: expandResponse.err,
        })
        return
    }

    // badge の取得には時間がかかる可能性があるのでまず空 badge で返す
    // expand の取得には時間がかからないはずなので expand の取得前には返さない
    post({ type: "succeed-to-load", menu: toMenu(info, expandResponse.expand, EMPTY_BADGE) })

    const badgeResponse = await client.badge.getBadge(nonce)
    if (!badgeResponse.success) {
        post({
            type: "failed-to-load",
            menu: toMenu(info, expandResponse.expand, EMPTY_BADGE),
            err: badgeResponse.err,
        })
        return
    }

    post({ type: "succeed-to-load", menu: toMenu(info, expandResponse.expand, badgeResponse.badge) })
}

type MenuInfo = Readonly<{
    tree: MenuTree
    roles: ApiRoles
    menuTarget: MenuTarget
}>

function toMenu({ tree, menuTarget, roles }: MenuInfo, expand: MenuExpand, badge: MenuBadge): Menu {
    return treeToMenu(tree)

    function treeToMenu(tree: MenuTree): Menu {
        return tree.flatMap(menuNodes)
    }
    function menuNodes(node: MenuTreeNode): MenuNode[] {
        switch (node.type) {
            case "category":
                return menuCategory(node.category, node.children)
            case "item":
                return [menuItem(node.item)]
        }
    }
    function menuCategory(category: MenuTreeCategory, tree: MenuTree): MenuNode[] {
        if (!isAllow()) {
            return EMPTY_MENU
        }

        const children = treeToMenu(tree)
        if (children.length === 0) {
            return EMPTY_MENU
        }

        const sumBadgeCount = children.reduce((acc, node) => acc + node.badgeCount, 0)

        return [
            {
                type: "category",
                isExpand: expand[category.label] || children.some(hasActive),
                badgeCount: sumBadgeCount,
                category: toMenuCategory(category),
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
        function hasActive(node: MenuNode): boolean {
            switch (node.type) {
                case "category":
                    return node.children.some(hasActive)
                case "item":
                    return node.isActive
            }
        }
    }
    function menuItem(item: MenuTreeItem): MenuNode {
        return {
            type: "item",
            isActive: menuTarget.versioned ? item.path === menuTarget.currentPath : false,
            badgeCount: badge[item.path] || 0,
            item: toMenuItem(item, menuTarget.version),
        }
    }
}

function toMenuCategory(category: MenuTreeCategory): MenuCategory {
    return markMenuCategory(category)
}
function toMenuItem({ label, icon, path }: MenuTreeItem, version: string): MenuItem {
    return markMenuItem({ label, icon, href: `/${version}/${path}` })
}

const EMPTY_EXPAND: MenuExpand = {}
const EMPTY_BADGE: MenuBadge = {}

const EMPTY_BREADCRUMB: Breadcrumb = []
const EMPTY_MENU: MenuNode[] = []