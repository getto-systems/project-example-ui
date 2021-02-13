import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { VNodeContent } from "../../../z_vendor/getto-css/preact/common"
import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import { v_medium } from "../../../z_vendor/getto-css/preact/design/alignment"

import { useComponent, useTermination } from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { spinner } from "../../common/icon"

import { appendScript } from "./script"

import { ApplicationError } from "../../common/System/ApplicationError"

import { RenewCredentialEntryPoint } from "../../../auth/z_EntryPoint/Login/entryPoint"

import { initialRenewComponentState } from "../../../auth/x_Resource/Login/RenewCredential/Renew/component"

import { RenewError } from "../../../auth/login/credentialStore/data"

export function RenewCredential({ resource: { renew }, terminate }: RenewCredentialEntryPoint): VNode {
    useTermination(terminate)

    const state = useComponent(renew, initialRenewComponentState)
    useEffect(() => {
        renew.request()
    }, [])

    useEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useEffect で行う
        switch (state.type) {
            case "try-to-instant-load":
                appendScript(state.scriptPath, (script) => {
                    script.onload = () => {
                        renew.succeedToInstantLoad()
                    }
                    script.onerror = () => {
                        renew.failedToInstantLoad()
                    }
                })
                break

            case "try-to-load":
                appendScript(state.scriptPath, (script) => {
                    script.onerror = () => {
                        renew.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${state.type}`,
                        })
                    }
                })
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-renew":
        case "required-to-login":
            return EMPTY_CONTENT

        case "try-to-instant-load":
        case "try-to-load":
            // スクリプトのロードは appendChild する必要があるため useEffect で行う
            return EMPTY_CONTENT

        case "succeed-to-set-continuous-renew":
            // このイベントは instant load 後に設定が完了したことを通知するものなので特に何もしない
            return EMPTY_CONTENT

        case "try-to-renew":
            // すぐに帰ってくるはずなので何も描画しない
            return EMPTY_CONTENT

        case "delayed-to-renew":
            return delayedMessage()

        case "failed-to-renew":
            return errorMessage(state.err)

        case "storage-error":
        case "load-error":
            return h(ApplicationError, { err: state.err.err })

        case "error":
            return h(ApplicationError, { err: state.err })
    }

    function delayedMessage() {
        return loginBox(siteInfo(), {
            title: "認証に時間がかかっています",
            body: [
                html`<p>${spinner} 認証処理中です</p>`,
                html`<p>
                    30秒以上かかる場合は何かがおかしいので、
                    <br />
                    お手数ですが管理者に連絡お願いします
                </p>`,
            ],
        })
    }
    function errorMessage(err: RenewError): VNode {
        return loginBox(siteInfo(), {
            title: "認証に失敗しました",
            body: [
                ...renewError(err).map((message) => html`<p>${message}</p>`),
                v_medium(),
                html`<p>お手数ですが、上記メッセージを管理者にお伝えください</p>`,
            ],
        })
    }
}

function renewError(err: RenewError): VNodeContent[] {
    switch (err.type) {
        case "bad-request":
            return ["認証情報の送信処理でエラーが発生しました"]

        case "server-error":
            return ["サーバーの認証処理でエラーが発生しました"]

        case "bad-response":
            return ["サーバーから送信されたデータがエラーでした", ...detail(err.err)]

        case "infra-error":
            return ["ネットワーク通信時にエラーが発生しました", ...detail(err.err)]
    }
}

function detail(err: string): string[] {
    if (err.length === 0) {
        return []
    }
    return [`(詳細: ${err})`]
}

const EMPTY_CONTENT: VNode = html``
