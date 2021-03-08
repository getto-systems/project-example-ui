import { h, VNode } from "preact"
import { useErrorBoundary } from "preact/hooks"
import { html } from "htm/preact"

import { loginBox } from "../../../z_vendor/getto-css/preact/layout/login"
import { buttons } from "../../../z_vendor/getto-css/preact/design/form"

import { useDocumentTitle, useEntryPoint } from "../../../x_preact/common/hooks"
import { siteInfo } from "../../../x_preact/common/site"
import { icon } from "../../../x_preact/common/icon"

import { ApplicationError } from "../../../x_preact/common/System/ApplicationError"

import { NotFoundEntryPoint, NotFoundResource } from "../entry_point"

export function NotFound(entryPoint: NotFoundEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)

    const [err] = useErrorBoundary((err) => {
        // 認証していないのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(NotFoundComponent, resource)
}

export type NotFoundProps = NotFoundResource
export function NotFoundComponent(props: NotFoundProps): VNode {
    useDocumentTitle("Not Found")

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
        return `/${props.version.getCurrent()}/index.html`
    }
}
