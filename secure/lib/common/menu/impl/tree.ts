import { Icon, iconClass, lnir } from "../../../z_external/icon"

import { MenuPermission, MenuTree, MenuTreeNode } from "../infra"

function category(label: string, permission: MenuPermission, children: MenuTree): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}
const any: MenuPermission = { type: "any" }
const dev: MenuPermission = { type: "role", roles: ["development-docs"] }

function item(label: string, icon: Icon, path: string): MenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}

export const mainMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/docs/index.html"),
    ]),
]

export const documentMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/docs/index.html"),
    ]),
    category("DEVELOPMENT", dev, [
        item("配備構成", lnir("files-alt"), "/docs/development/deployment.html"),
        item("認証・認可", lnir("files-alt"), "/docs/development/auth.html"),
    ]),
]
