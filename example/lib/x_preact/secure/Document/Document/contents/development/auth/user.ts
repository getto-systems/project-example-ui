import { VNode } from "preact"
import { html } from "htm/preact"

import { container, v_medium } from "../../../../../../common/layout"
import { box, itemsSection } from "../../../box"

import { content_auth_user } from "../../auth"

export const content_development_auth_user = (): VNode[] => [
    container([
        content_auth_user(),
        box("業務で必要な時に使用するために", [
            itemsSection("ユーザー情報を管理できる", [
                "ログインID 変更",
                "パスワード変更",
                "web 証明書変更",
            ]),
        ]),
        box("業務内容をプライベートに保つために", [
            itemsSection("ユーザーの状態を管理できる", [
                "ログイン可否の変更",
                "アクセスを許可するコンテンツ",
            ]),
        ]),
    ]),
    v_medium(),
    container(manageUser()),
]

function manageUser() {
    return html`
        ${box(
            "ユーザー登録(あとで)",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>ユーザーの登録</p>`
        )}
        ${box(
            "特定ユーザーログインID 変更(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのログインIDを変更</p>`
        )}
        ${box(
            "特定ユーザーパスワード変更(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのパスワードを変更</p>`
        )}
        ${box(
            "特定ユーザーパスワード削除(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーのパスワードを削除</p>`
        )}
        ${box(
            "特定ユーザー無効化(あとで)管理者",
            html` <p>チケットの検証</p>
                <p>管理者権限を確認</p>
                <p>特定ユーザーの全チケットの最大延長期間を削除</p>`
        )}
    `
}
