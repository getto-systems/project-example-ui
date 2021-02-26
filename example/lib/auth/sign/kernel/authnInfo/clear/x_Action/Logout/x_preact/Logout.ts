import { h, VNode } from "preact"
import { useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { box } from "../../../../../../../../z_vendor/getto-css/preact/design/box"
import { button_send, field } from "../../../../../../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../../../../../../z_vendor/getto-css/preact/design/highlight"
import { v_small } from "../../../../../../../../z_vendor/getto-css/preact/design/alignment"

import { useApplicationAction } from "../../../../../../../../x_preact/common/hooks"

import { LogoutResource, LogoutState } from "../action"

import { StorageError } from "../../../../../../../../z_vendor/getto-application/storage/data"

export function Logout(resource: LogoutResource): VNode {
    return h(View, <LogoutProps>{
        ...resource,
        state: useApplicationAction(resource.logout),
    })
}

export type LogoutProps = LogoutResource & Readonly<{ state: LogoutState }>
export function View(props: LogoutProps): VNode {
    useLayoutEffect(() => {
        switch (props.state.type) {
            case "succeed-to-logout":
                // credential が削除されているので、reload するとログイン画面になる
                location.reload()
                break
        }
    }, [props.state])

    switch (props.state.type) {
        case "initial-logout":
        case "succeed-to-logout":
            return logoutBox({ success: true })

        case "failed-to-logout":
            return logoutBox({ success: false, err: props.state.err })
    }

    type LogoutBoxContent =
        | Readonly<{ success: true }>
        | Readonly<{ success: false; err: StorageError }>

    function logoutBox(content: LogoutBoxContent): VNode {
        return box({
            body: [
                v_small(),
                field({
                    title: "ログアウト",
                    body: button_send({ label: "ログアウト", state: "normal", onClick }),
                    help: ["作業完了後ログアウトしてください"],
                }),
                ...error(),
            ],
        })

        function onClick() {
            props.logout.submit()
        }

        function error(): VNode[] {
            if (content.success) {
                return []
            }
            return [
                v_small(),
                notice_alert("ログアウトの処理中にエラーが発生しました"),
                ...detail(content.err),
            ]

            function detail(err: StorageError): VNode[] {
                if (err.err.length === 0) {
                    return []
                }
                return [html`<p>詳細: ${err.err}</p>`]
            }
        }
    }
}
