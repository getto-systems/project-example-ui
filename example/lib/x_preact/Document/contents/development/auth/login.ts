import { VNode } from "preact"
import { html } from "htm/preact"

import { container, v_medium } from "../../../../common/layout"
import { box, box_double, items, itemsSection, negativeNote, pending, validate } from "../../../box"

import { content_auth_login } from "../../auth"
import {
    fromApiServer,
    hr,
    inApiServer,
    inBrowser,
    inContentServer,
    serverClients,
    toApiServer,
    toContentServer,
} from "../form"

export const content_development_auth_login = (): VNode[] => [
    container([
        content_auth_login(),
        box("業務で必要な時に使用するために", [
            html`
                <p>有効期限付きのトークンを発行する</p>
                <p>有効期限が切れるまでは使用できる</p>
                <p>有効期限を延長できる</p>
            `,
        ]),
        box("業務内容をプライベートに保つために", [
            html`
                <p>トークンは署名して送信</p>
                <p>トークンはセキュアな方法で送信</p>
                <p>コンテンツのアクセス制限</p>
            `,
        ]),
    ]),
    container(general()),
    v_medium(),
    container(renewCredential()),
    v_medium(),
    container(passwordLogin()),
    v_medium(),
    container(webAuthn()),
]

function general(): VNode[] {
    return [
        serverClients(),
        box_double("判明しているダメな点", [
            negativeNote(
                "チケットの有効期限切れの前にチケットを無効化できない",
                "（最大延長期間を操作することで再認証を促すことは可能）"
            ),
            negativeNote(
                "チケットが漏れた場合、有効期限延長を続けることで最大期間アクセス可能",
                "（これをするためには cookie の奪取とメモリの解析を行う必要があるので、事実上不可能としていいかな）"
            ),
            negativeNote(
                "http を使用することを想定",
                "（http 以外の方式で通信する必要が出たときに考える）"
            ),
            negativeNote(
                "cookie を使用するため別なタブで別ユーザーとしてログインできない",
                "（アプリケーションを別ユーザーでログインする必要がある設計にしないことで対応）"
            ),
        ]),
    ]
}

const renewCredential = () => [
    box("認証トークンの更新", [
        itemsSection("インスタントロード", ["有効期限内ならすぐにロード"]),
        itemsSection("認証トークン更新", ["認証トークンの有効期限を延長"]),
        itemsSection("継続更新", ["一定期間ごとに認証トークン更新"]),
    ]),
    box("インスタントロード", [
        toContentServer("認証トークン", ["cookie"]),
        inContentServer("スクリプトをロード", ["認証トークンが有効な場合"]),
        hr,
        html`<p>認証トークンが有効期限切れの場合は認証トークン更新の後ロードを試みる</p>`,
    ]),
    box("認証トークン更新", [
        toApiServer("チケットトークン", ["cookie + nonce"]),
        inApiServer(
            items([
                validate("チケットトークン検証"),
                validate("チケット有効期限検証"),
                "チケット有効期限延長",
                "チケットトークン発行",
                "API トークン発行",
                "コンテンツトークン発行",
            ]),
            []
        ),
        fromApiServer("認証トークン", ["チケットトークン", "API トークン / 権限", "コンテンツトークン"]),
        hr,
        itemsSection("認証トークンを失効させる検証", ["チケットトークン検証", "チケット有効期限検証"]),
    ]),
    box("継続更新", [html`<p>処理は認証トークン更新と同様</p>`, html`<p>一定期間ごとに更新を行う</p>`]),
]
const passwordLogin = () => [
    box("パスワードログイン", [
        itemsSection("ログインID・パスワード入力", ["入力形式を検証"]),
        itemsSection("認証リクエスト", ["認証トークンを要求"]),
    ]),
    box("ログインID・パスワード入力", [
        inBrowser(items([validate("ログインID 検証"), validate("パスワード検証")]), []),
        hr,
        html`<p>検証失敗なら認証リクエストできない</p>`,
        v_medium(),
        itemsSection("ログインID 検証", [
            "空でないこと",
            // TODO 長すぎないことをチェックしたほうがいい
        ]),
        itemsSection("パスワード検証", ["空でないこと", "長すぎないこと"]),
    ]),
    box("認証リクエスト", [
        toApiServer(items(["ログインiD", "パスワード"]), []),
        inApiServer(
            items([
                validate("パスワード検証"),
                "チケットトークン発行",
                "API トークン発行",
                "コンテンツトークン発行",
            ]),
            []
        ),
        fromApiServer("認証トークン", ["チケットトークン", "API トークン / 権限", "コンテンツトークン"]),
        hr,
        // TODO ログインID が長すぎないことをチェックしたほうがいい
        itemsSection("パスワード検証", [
            "空でないこと",
            "長すぎないこと",
            "保存されているハッシュ化パスワードとの同一性検証が通ること",
        ]),
    ]),
]
function webAuthn() {
    return html`
        ${box(
            pending("web 証明書認証"),
            html` <p>web 証明書の検証</p>
                <p>チケットを新規発行</p>
                <p>API トークンを発行</p>
                <p>コンテンツトークンを発行</p>`
        )}
        ${box(
            pending("web 証明書登録"),
            html` <p>チケットの検証</p>
                <p>パスワードの検証</p>
                <p>新 web 証明書の登録</p>
                <small><p>以前の証明書は使用できなくなる</p></small>`
        )}
    `
}
