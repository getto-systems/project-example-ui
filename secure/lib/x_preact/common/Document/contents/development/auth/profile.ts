import { VNode } from "preact"
import { html } from "htm/preact"

import { container, v_medium } from "../../../../../layout"
import { box, items, itemsSection, validate } from "../../../box"

import { content_auth_profile } from "../../auth"
import { fromApiServer, hr, inApiServer, inBrowser, toApiServer } from "../form"

export const content_development_auth_profile = (): VNode[] => [
    container([
        content_auth_profile(),
        box("業務で必要な時に使用するために", [
            html`
                <p>パスワードを変更できる</p>
                <p>web 証明書を登録できる</p>
            `,
        ]),
        box("業務内容をプライベートに保つために", [html`<p>ログアウトできる</p>`]),
    ]),
    v_medium(),
    container(passwordChange()),
    v_medium(),
    container(logout()),
]

const passwordChange = () => [
    box("パスワード変更", [
        itemsSection("ログインID 取得", ["現在の認証トークンを取得したログインID を取得"]),
        itemsSection("旧パスワード・新パスワード入力", ["入力形式を検証"]),
        itemsSection("パスワード更新", ["ログインID のパスワードを変更"]),
    ]),
    box("ログインID 取得", [
        toApiServer("チケットトークン", ["cookie + nonce"]),
        inApiServer(items([validate("チケットトークン検証"), validate("チケット有効期限検証")]), []),
        fromApiServer("ログインID", ["パスワードを変更しようとしているログインID を表示"]),
        hr,
        itemsSection("認証トークンを失効させる検証", ["チケットトークン検証", "チケット有効期限検証"]),
    ]),
    box("旧パスワード・新パスワード入力", [
        inBrowser(items([validate("旧パスワード検証"), validate("新パスワード検証")]), []),
        hr,
        html`<p>検証失敗なら認証リクエストできない</p>`,
        v_medium(),
        itemsSection("旧パスワード検証", ["空でないこと", "長すぎないこと"]),
        itemsSection("新パスワード検証", ["空でないこと", "長すぎないこと"]),
    ]),
    box("パスワード変更", [
        toApiServer(items(["チケット", "ログインID", "旧パスワード", "新パスワード"]), []),
        inApiServer(
            items([
                validate("チケットトークン検証"),
                validate("チケット有効期限検証"),
                validate("ログインID 検証"),
                validate("旧パスワード検証"),
                validate("新パスワード検証"),
                "パスワード変更",
            ]),
            []
        ),
        hr,
        itemsSection("認証トークンを失効させる検証", ["チケットトークン検証", "チケット有効期限検証"]),
        html`<p>旧パスワードは使用できなくなる</p>`,
        v_medium(),
        itemsSection("ログインID 検証", [
            // TODO 長すぎないことをチェックしたほうがいい
            "ユーザーのログインID と一致すること",
        ]),
        itemsSection("旧パスワード検証", [
            "空でないこと",
            "長すぎないこと",
            "保存されているハッシュ化パスワードとの同一性検証が通ること",
        ]),
        itemsSection("新パスワード検証", [
            "空でないこと",
            "長すぎないこと",
        ]),
    ]),
]
const logout = () => [
    box("ログアウト", [
        toApiServer("チケットトークン", ["cookie + nonce"]),
        inApiServer(
            items([
                validate("チケットトークン検証"),
                validate("チケット有効期限検証"),
                "チケット有効期限無効化",
            ]),
            []
        ),
        hr,
        html`<p>ログアウトで認証情報は失効</p>`,
        v_medium(),
        itemsSection("認証トークンを失効させる検証", ["チケットトークン検証", "チケット有効期限検証"]),
    ]),
]
