import { newLoadOutlineMenuBadgeNoopRemoteAccess } from "../infra/remote/loadOutlineMenuBadge/noop"
import { newDocumentOutlineMenuExpandRepository } from "../infra/repository/outlineMenuExpand/main"

import { lnir } from "../../../../../z_external/icon/core"

import { category, newOutlineMenuAction, item, newOutlineBreadcrumbListAction } from "./common"

import { OutlineMenuPermission, OutlineMenuTree } from "../infra"

import { LoadOutlineAction } from "../action"

export function newDocumentOutlineAction(webStorage: Storage, currentURL: URL): LoadOutlineAction {
    const menuTree = documentMenuTree()
    return {
        breadcrumbList: newOutlineBreadcrumbListAction(currentURL, menuTree),
        menu: newOutlineMenuAction(
            webStorage,
            currentURL,
            newDocumentOutlineMenuExpandRepository,
            menuTree,
            newLoadOutlineMenuBadgeNoopRemoteAccess()
        ),
    }
}

const allow: OutlineMenuPermission = { type: "allow" }
const dev: OutlineMenuPermission = { type: "role", role: "development-document" }

const documentMenuTree = (): OutlineMenuTree => [
    category("MAIN", allow, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("ドキュメント", allow, [item("認証・認可", lnir("files-alt"), "/document/auth.html")]),
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
