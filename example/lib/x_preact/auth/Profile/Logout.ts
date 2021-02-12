import { VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { box } from "../../../z_vendor/getto-css/preact/design/box"
import { button_delete } from "../../../z_vendor/getto-css/preact/design/form"
import { notice_alert } from "../../../z_vendor/getto-css/preact/design/highlight"
import { v_medium } from "../../../z_vendor/getto-css/preact/design/alignment"

import { useComponent } from "../../z_common/hooks"

import {
    LogoutComponent,
    initialLogoutComponentState,
} from "../../../auth/z_EntryPoint/Profile/logout/component"

import { StorageError } from "../../../auth/common/credential/data"

type Props = Readonly<{
    logout: LogoutComponent
}>
export function Logout({ logout }: Props): VNode {
    const state = useComponent(logout, initialLogoutComponentState)
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
            title: "ログアウト",
            body: [button_delete({ label: "ログアウト", state: "normal", onClick }), ...error()],
        })

        function onClick() {
            logout.submit()
        }

        function error(): VNode[] {
            if (content.success) {
                return []
            }
            return [
                v_medium(),
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
