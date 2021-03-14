import { DocsSection } from "../../../z_vendor/getto-application/docs/data"
import { docsDescription, docsSection } from "../../../z_vendor/getto-application/docs/helper"

export const docs_auth_sign_authTicket: DocsSection[] = [
    docsSection("認証チケット", [
        docsDescription([
            {
                title: "認証チケット",
                body: ["有効期限付きのチケット", "認証・認可のためのトークン"],
                help: ["サーバーアクセスに必要", "認証トークンは http only な cookie で配信"],
            },
        ]),
        docsDescription([
            {
                title: "認証情報",
                body: ["nonce・認証時刻"],
                help: [
                    "public な手続きのため認証 nonce を送信",
                    "認証時刻を参照して必要な時に更新する",
                ],
            },
        ]),
        docsDescription([
            {
                title: "認可情報",
                body: ["nonce・権限"],
                help: [
                    "secure な手続きのため認可 nonce を送信",
                    "権限によってメニューの表示を切り替え",
                ],
            },
        ]),
    ]),
    docsSection("コンテンツサーバー", [
        docsDescription([
            {
                title: "public",
                body: ["認証情報の不要なコンテンツ"],
                help: ["認証とアップデートを行うための入り口"],
            },
            {
                title: "secure",
                body: ["認証情報の必要なコンテンツ"],
                help: ["認証トークン送信でアクセス可能", "アプリケーション本体"],
            },
        ]),
    ]),
    docsSection("APIサーバー", [
        docsDescription([
            {
                title: "public",
                body: ["認証情報に関する手続きを行う"],
                help: ["認証 nonce 送信でアクセス可能", "認証情報のチェック・更新・破棄など"],
            },
            {
                title: "secure",
                body: ["認証が必要な手続きを行う"],
                help: [
                    "認可 nonce 送信でアクセス可能",
                    "アプリケーション本体の手続き",
                    "ログインユーザーの認証プロフィール変更",
                    "認証ユーザーの管理",
                ],
            },
        ]),
    ]),
]
