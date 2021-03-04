import { newLoadOutlineMenuBadgeNoopRemote } from "../infra/remote/loadMenuBadge/noop"

import { lnir } from "../../../../../z_external/icon/core"

import { category, newOutlineMenuAction, item, newOutlineBreadcrumbListAction } from "./common"

import { OutlineMenuPermission, OutlineMenuTree } from "../infra"

import { LoadOutlineAction } from "../action"
import { newOutlineMenuExpandRepository } from "../infra/repository/menuExpand"
import { env } from "../../../../../y_environment/env"

export function newDocumentOutlineAction(
    webStorage: Storage,
    currentLocation: Location,
): LoadOutlineAction {
    const menuTree = documentMenuTree()
    return {
        breadcrumbList: newOutlineBreadcrumbListAction(currentLocation, menuTree),
        menu: newOutlineMenuAction(
            webStorage,
            currentLocation,
            newOutlineMenuExpandRepository(webStorage, env.storageKey.menuExpand.document),
            menuTree,
            newLoadOutlineMenuBadgeNoopRemote(),
        ),
    }
}

const allow: OutlineMenuPermission = { type: "allow" }
const dev: OutlineMenuPermission = { type: "role", role: "development-document" }

const documentMenuTree = (): OutlineMenuTree => [
    category("MAIN", allow, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/docs/index.html"),
    ]),
    category("ドキュメント", allow, [item("認証・認可", lnir("files-alt"), "/docs/auth.html")]),
    category("開発向け", dev, [
        item("Storybook", lnir("files-alt"), "/storybook/index.html"),
        item("coverage", lnir("files-alt"), "/coverage/lcov-report/index.html"),
        item("配備構成", lnir("files-alt"), "/docs/z_dev/deployment.html"),
        category("認証・認可", dev, [
            item("ログイン", lnir("files-alt"), "/docs/z_dev/auth/login.html"),
            item("アクセス制限", lnir("files-alt"), "/docs/z_dev/auth/permission.html"),
            item("ユーザー管理", lnir("files-alt"), "/docs/z_dev/auth/user.html"),
            item("認証情報管理", lnir("files-alt"), "/docs/z_dev/auth/profile.html"),
            item("API 詳細設計", lnir("files-alt"), "/docs/z_dev/auth/api.html"),
        ]),
    ]),
]
