import { env } from "../../../../y_environment/env"
import { lnir } from "../../../../z_external/icon/line_icon"
import { MenuContent, MenuPermission } from "../infra"
import { category, item } from "./common"

export function docsMenuContent(): MenuContent {
    return {
        key: env.storageKey.menuExpand.docs,
        menuTree: [
            category("MAIN", allow, [
                item("ホーム", lnir("home"), "/index.html"),
                item("ドキュメント", lnir("files-alt"), "/docs/index.html"),
            ]),
            category("ドキュメント", allow, [
                item("認証・認可", lnir("files-alt"), "/docs/auth.html"),
            ]),
            category("開発向け", dev, [
                item("Storybook", lnir("files-alt"), "/storybook/index.html"),
                item("coverage", lnir("files-alt"), "/coverage/lcov-report/index.html"),
                item("配備構成", lnir("files-alt"), "/docs/z-dev/deployment.html"),
                category("認証・認可", dev, [
                    item("ログイン", lnir("files-alt"), "/docs/z-dev/auth/login.html"),
                    item("アクセス制限", lnir("files-alt"), "/docs/z-dev/auth/permission.html"),
                    item("ユーザー管理", lnir("files-alt"), "/docs/z-dev/auth/user.html"),
                    item("認証情報管理", lnir("files-alt"), "/docs/z-dev/auth/profile.html"),
                    item("API 詳細設計", lnir("files-alt"), "/docs/z-dev/auth/api.html"),
                ]),
            ]),
        ],
    }
}

const allow: MenuPermission = { type: "allow" }
const dev: MenuPermission = { type: "role", role: "dev-docs" }
