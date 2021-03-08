import { StaticMenuPath } from "../../../../y_environment/path"

import { Icon, iconClass } from "../../../../z_external/icon/core"

import { MenuPermission, MenuTree, MenuTreeNode } from "../infra"

export function category(
    label: string,
    permission: MenuPermission,
    children: MenuTree,
): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}

export function item(label: string, icon: Icon, path: StaticMenuPath): MenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}
