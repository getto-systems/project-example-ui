import { StaticMenuPath } from "../../../../../y_environment/path"

import { Icon, iconClass, lnir } from "../../../../../z_vendor/icon"

import { MenuPermission, MenuTree, MenuTreeNode } from "../../../../permission/menu/infra"

function category(label: string, permission: MenuPermission, children: MenuTree): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}
const any: MenuPermission = { type: "any" }
const dev: MenuPermission = { type: "role", roles: ["development-document"] }

function item(label: string, icon: Icon, path: StaticMenuPath): MenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}

export const mainMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
]

export const documentMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("ドキュメント", any, [item("認証・認可", lnir("files-alt"), "/document/auth.html")]),
    category("開発向け", dev, [
        item("Storybook", lnir("files-alt"), "/storybook/index.html"),
        item("配備構成", lnir("files-alt"), "/document/development/deployment.html"),
        category("認証・認可", dev, [
            item("ログイン", lnir("files-alt"), "/document/development/auth/login.html"),
            item("アクセス制限", lnir("files-alt"), "/document/development/auth/permission.html"),
            item("ユーザー管理", lnir("files-alt"), "/document/development/auth/user.html"),
            item("認証情報管理", lnir("files-alt"), "/document/development/auth/profile.html"),
            item("API 詳細設計", lnir("files-alt"), "/document/development/auth/api.html"),
        ]),
    ]),
]
