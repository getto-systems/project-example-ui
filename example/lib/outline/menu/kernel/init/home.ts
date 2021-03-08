import { env } from "../../../../y_environment/env"
import { lnir } from "../../../../z_external/icon/core"
import { MenuContent, MenuPermission } from "../infra"
import { category, item } from "./common"

export function homeMenuContent(): MenuContent {
    return {
        key: env.storageKey.menuExpand.home,
        menuTree: [
            category("MAIN", allow, [
                item("ホーム", lnir("home"), "/index.html"),
                item("ドキュメント", lnir("files-alt"), "/docs/index.html"),
            ]),
            category("SYSTEM", allow, [item("プロフィール", lnir("user"), "/auth/profile.html")]),
        ],
    }
}

const allow: MenuPermission = { type: "allow" }
