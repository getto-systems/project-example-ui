import { Icon, iconClass, lnir } from "../../../z_external/icon"

import { MenuPath, MenuPermission, MenuTree, MenuTreeNode } from "../infra"

function category(label: string, permission: MenuPermission, children: MenuTree): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}
const any: MenuPermission = { type: "any" }
const dev: MenuPermission = { type: "role", roles: ["development-docs"] }

function item(label: string, icon: Icon, path: MenuPath): MenuTreeNode {
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
    category("DOCUMENT", any, [item("認証・認可", lnir("files-alt"), "/docs/auth.html")]),
    category("DEVELOPMENT", dev, [
        item("配備構成", lnir("files-alt"), "/docs/development/deployment.html"),
        category("認証・認可", dev, [
            item("ログイン", lnir("files-alt"), "/docs/development/auth/login.html"),
        ]),
    ]),
]
