import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginBox } from "../../../../../../z_vendor/getto-css/preact/layout/login"
import { v_medium } from "../../../../../../z_vendor/getto-css/preact/design/alignment"

import { VNodeContent } from "../../../../../../common/x_preact/common"
import { useApplicationAction, useEntryPoint } from "../../../../../../x_preact/common/hooks"
import { siteInfo } from "../../../../../../x_preact/common/site"
import { spinner } from "../../../../../../x_preact/common/icon"

import { appendScript } from "../../../../common/x_preact/script"

import { ApplicationError } from "../../../../../../common/x_preact/ApplicationError"

import {
    CheckAuthInfoEntryPoint,
    CheckAuthInfoResource,
    CheckAuthInfoResourceState,
} from "../entry_point"
import { RenewAuthInfoError } from "../../kernel/data"

export function CheckAuthInfo(entryPoint: CheckAuthInfoEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)
    return h(CheckAuthInfoComponent, {
        ...resource,
        state: useApplicationAction(resource.core),
    })
}

export type CheckAuthInfoProps = CheckAuthInfoResource & CheckAuthInfoResourceState
export function CheckAuthInfoComponent(props: CheckAuthInfoProps): VNode {
    useLayoutEffect(() => {
        // スクリプトのロードは appendChild する必要があるため useLayoutEffect で行う
        switch (props.state.type) {
            case "try-to-instant-load":
                if (!props.state.scriptPath.valid) {
                    props.core.loadError({
                        type: "infra-error",
                        err: `スクリプトのロードに失敗しました: ${props.state.type}`,
                    })
                    break
                }
                appendScript(props.state.scriptPath.value, (script) => {
                    script.onload = () => {
                        props.core.succeedToInstantLoad()
                    }
                    script.onerror = () => {
                        props.core.failedToInstantLoad()
                    }
                })
                break

            case "try-to-load":
                if (!props.state.scriptPath.valid) {
                    props.core.loadError({
                        type: "infra-error",
                        err: `スクリプトのロードに失敗しました: ${props.state.type}`,
                    })
                    break
                }
                appendScript(props.state.scriptPath.value, (script) => {
                    script.onerror = () => {
                        props.core.loadError({
                            type: "infra-error",
                            err: `スクリプトのロードに失敗しました: ${props.state.type}`,
                        })
                    }
                })
                break
        }
    }, [props.state])

    switch (props.state.type) {
        case "initial-check":
        case "required-to-login":
            return EMPTY_CONTENT

        case "try-to-instant-load":
        case "try-to-load":
            // スクリプトのロードは appendChild する必要があるため useLayoutEffect で行う
            return EMPTY_CONTENT

        case "succeed-to-start-continuous-renew":
        case "succeed-to-continuous-renew":
        case "lastAuth-not-expired":
        case "failed-to-continuous-renew":
            // これらはスクリプトがロードされた後に発行される
            // したがって、un-mount されているのでここには来ない
            return EMPTY_CONTENT

        case "try-to-renew":
            // すぐに帰ってくることを想定
            // 時間がかかると delayed-to-renew が発行される
            return EMPTY_CONTENT

        case "delayed-to-renew":
            return delayedMessage()

        case "failed-to-renew":
            return errorMessage(props.state.err)

        case "repository-error":
        case "load-error":
            return h(ApplicationError, { err: props.state.err.err })
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
    function errorMessage(err: RenewAuthInfoError): VNode {
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

function renewError(err: RenewAuthInfoError): VNodeContent[] {
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
