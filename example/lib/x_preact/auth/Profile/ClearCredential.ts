import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { box } from "../../../z_vendor/getto-css/preact/design/box"
import { button_delete, field } from "../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"
import { v_small } from "../../../z_vendor/getto-css/preact/design/alignment"

import { useComponent } from "../../common/hooks"

import { ClearCredentialResource } from "../../../auth/x_Resource/Sign/ClearCredential/resource"

import { initialLogoutComponentState } from "../../../auth/x_Resource/Sign/ClearCredential/Logout/component"

import { StorageError } from "../../../auth/common/credential/data"

export function ClearCredential(resource: ClearCredentialResource): VNode {
    const state = useComponent(resource.logout, initialLogoutComponentState)
    useEffect(() => {
        switch (state.type) {
            case "succeed-to-logout":
                // credential が削除されているので、reload するとログイン画面になる
                location.reload()
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-logout":
        case "succeed-to-logout":
            return logoutBox({ success: true })

        case "failed-to-logout":
            return logoutBox({ success: false, err: state.err })
    }

    type LogoutBoxContent = Readonly<{ success: true }> | Readonly<{ success: false; err: StorageError }>

    function logoutBox(content: LogoutBoxContent): VNode {
        return box({
            body: [
                v_small(),
                field({
                    title: "ログアウト",
                    body: button_delete({ label: "ログアウト", state: "normal", onClick }),
                    help: ["作業完了後ログアウトしてください"],
                }),
                ...error(),
            ],
        })

        function onClick() {
            resource.logout.submit()
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
