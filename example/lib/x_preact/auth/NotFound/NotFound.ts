import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import { buttons } from "../../../z_vendor/getto-css/preact/design/form"

import {
    useApplicationAction,
    useDocumentTitle,
    useTermination_deprecated,
} from "../../common/hooks"
import { siteInfo } from "../../common/site"
import { icon } from "../../common/icon"

import { ApplicationError } from "../../common/System/ApplicationError"

import { NotFoundEntryPoint } from "../../../availability/z_EntryPoint/NotFound/entryPoint"

import { CurrentVersionComponent } from "../../../availability/x_Resource/GetCurrentVersion/currentVersion/component"

export function EntryPoint({ resource, terminate }: NotFoundEntryPoint): VNode {
    useTermination_deprecated(terminate)

    const [err] = useErrorBoundary((err) => {
        // 認証していないのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useDocumentTitle("Not Found")

    return h(Content, resource)
}

type ContentProps = Readonly<{
    currentVersion: CurrentVersionComponent
}>
function Content({ currentVersion }: ContentProps): VNode {
    const state = useApplicationAction(currentVersion)

    return loginBox(siteInfo(), {
        title: "リンクが切れていました",
        body: [
            html`<p>
                リンクされたページが見つかりませんでした<br />
                これはシステム側の不備です
            </p>`,
            html`<p>
                お手数ですが、管理者にクリックしたリンクをお伝えください<br />
                直前まで行っていた作業も教えていただけると助かります
            </p>`,
            html`<p>作業は左下のリンクからホームに戻って続けられます</p>`,
        ],
        footer: buttons({
            left: [html`<a href="${homeHref()}">${icon("home")} ホームへ</a>`],
        }),
    })

    function homeHref() {
        switch (state.type) {
            case "initial-current-version":
                return "#"

            case "succeed-to-find":
                return `/${state.version}/index.html`
        }
    }
}
