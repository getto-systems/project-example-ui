import {
    docsAction,
    docsModule,
    docsNote,
    docsSection,
} from "../../../z_vendor/getto-application/docs/helper"

import { DocsSection } from "../../../z_vendor/getto-application/docs/data"

export const docs_auth_checkAuthTicket: DocsSection[] = [
    docsSection("認証チケット更新", [
        docsModule(["コンテンツのロード", "チケット有効期限更新", "定期的に継続更新"]),
    ]),
]

export const docs_auth_checkAuthTicket_description: DocsSection[] = [
    ...docs_auth_checkAuthTicket,

    docsSection("コンテンツのロード", [
        docsAction(({ request, action, message }) => [
            request({
                from: "http-client",
                to: "content-server",
                body: [...message(["コンテンツトークン"])],
                help: [],
            }),
            action({
                on: "content-server",
                body: [...message(["コンテンツのロード"])],
                help: ["有効期限内であればコンテンツがロードできる"],
            }),
        ]),
        docsNote(["コンテンツトークンの有効期限が切れていた場合は認証チケット更新に移る"]),
    ]),
    docsSection("チケット有効期限更新", [
        docsAction(({ request, action, validate, message }) => [
            request({
                from: "http-client",
                to: "api-server",
                body: [...message(["認証トークン・nonce"])],
                help: [],
            }),
            action({
                on: "api-server",
                body: [
                    ...validate(["認証トークン・nonce 検証", "認証チケット有効期限検証"]),
                    ...message([
                        "認証チケット有効期限延長",
                        "認証トークン発行",
                        "認可トークン発行",
                        "コンテンツトークン発行",
                    ]),
                ],
                help: [],
            }),
            request({
                from: "api-server",
                to: "http-client",
                body: [...message(["認証チケット"])],
                help: ["各トークンは cookie へ登録"],
            }),
        ]),
        docsNote(["検証失敗で認証トークンは失効", "更新失敗の場合はログイン画面に遷移"]),
    ]),
    docsSection("チケット継続更新", [
        docsAction(({ request, action, validate, message }) => [
            request({
                from: "http-client",
                to: "api-server",
                body: [...message(["認証トークン・nonce"])],
                help: ["一定間隔で認証チケットの有効期限を更新"],
            }),
            action({
                on: "api-server",
                body: [
                    ...validate(["認証トークン・nonce 検証", "認証チケット有効期限検証"]),
                    ...message([
                        "認証チケット有効期限延長",
                        "認証トークン発行",
                        "認可トークン発行",
                        "コンテンツトークン発行",
                    ]),
                ],
                help: [],
            }),
            request({
                from: "api-server",
                to: "http-client",
                body: [...message(["認証チケット"])],
                help: ["保存されている認証チケット情報を上書き"],
            }),
        ]),
        docsNote(["検証失敗で認証トークンは失効"]),
    ]),
]
