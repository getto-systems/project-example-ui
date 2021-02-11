import { h, VNode } from "preact"
import { useEffect, useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import { buttons } from "../../../z_vendor/getto-css/preact/design/form"

import { useComponent, useTermination } from "../../z_common/hooks"
import { siteInfo } from "../../z_common/site"
import { icon } from "../../z_common/icon"

import { ApplicationError } from "../../z_common/System/ApplicationError"

import { NotFoundEntryPoint } from "../../../auth/x_components/NotFound/EntryPoint/entryPoint"

import {
    CurrentVersionComponent,
    initialCurrentVersionComponentState,
} from "../../../auth/x_components/NotFound/currentVersion/component"

type Props = NotFoundEntryPoint
export function EntryPoint({ resource, terminate }: Props): VNode {
    const [err] = useErrorBoundary((err) => {
        // 認証していないのでエラーはどうしようもない
        console.log(err)
    })

    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    useTermination(terminate)

    useEffect(() => {
        document.title = `Not Found | ${document.title}`
    }, [])

    return h(Content, resource)
}

type ContentProps = Readonly<{
    currentVersion: CurrentVersionComponent
}>
function Content({ currentVersion }: ContentProps): VNode {
    const state = useComponent(currentVersion, initialCurrentVersionComponentState)
    useEffect(() => {
        currentVersion.load()
    }, [])

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
