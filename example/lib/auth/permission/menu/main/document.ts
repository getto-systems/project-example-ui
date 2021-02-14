import { newLoadMenuBadgeNoopRemoteAccess } from "../infra/remote/menuBadge/noop"
import { newDocumentMenuExpandRepository } from "../infra/repository/main"

import { lnir } from "../../../../z_vendor/icon"

import { category, newMenuActionPod, item } from "./common"

import { initBreadcrumbListActionPod } from "../impl"

import { MenuPermission, MenuTree } from "../infra"

import { BreadcrumbListActionPod, MenuActionPod } from "../action"

export function newDocumentBreadcrumbListActionPod(): BreadcrumbListActionPod {
    return initBreadcrumbListActionPod({ menuTree: documentMenuTree() })
}

export function newDocumentMenuActionPod(webStorage: Storage): MenuActionPod {
    return newMenuActionPod(
        webStorage,
        newDocumentMenuExpandRepository,
        documentMenuTree(),
        newLoadMenuBadgeNoopRemoteAccess()
    )
}

const any: MenuPermission = { type: "any" }
const dev: MenuPermission = { type: "role", roles: ["development-document"] }

const documentMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("ドキュメント", any, [item("認証・認可", lnir("files-alt"), "/document/auth.html")]),
    category("開発向け", dev, [
        item("Storybook", lnir("files-alt"), "/storybook/index.html"),
        item("coverage", lnir("files-alt"), "/coverage/lcov-report/index.html"),
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
