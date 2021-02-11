import { env } from "../../../../y_environment/env"

import { lnir } from "../../../../z_vendor/icon"

import { category, initMenuAction, item } from "./common"

import { initLoadMenuBadgeSimulateRemoteAccess } from "../impl/remote/menuBadge/simulate"

import { MenuPermission, MenuTree } from "../infra"

import { MenuAction } from "../action"

export function initMainMenuAction(menuExpandStorage: Storage): MenuAction {
    return initMenuAction(
        mainMenuTree(),
        menuExpandStorage,
        env.storageKey.menuExpand.main,
        initLoadMenuBadgeSimulateRemoteAccess(() => ({ success: true, value: { "/index.html": 50 } }), {
            wait_millisecond: 0,
        })
    )
}

const any: MenuPermission = { type: "any" }

const mainMenuTree = (): MenuTree => [
    category("MAIN", any, [
        item("ホーム", lnir("home"), "/index.html"),
        item("ドキュメント", lnir("files-alt"), "/document/index.html"),
    ]),
    category("SYSTEM", any, [item("プロフィール", lnir("user"), "/profile/index.html")]),
]
