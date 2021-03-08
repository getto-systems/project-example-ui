import { h, VNode } from "preact"
import { useErrorBoundary, useLayoutEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginBox } from "../../../../z_vendor/getto-css/preact/layout/login"
import { siteInfo } from "../../../../x_preact/common/site"
import { spinner } from "../../../../x_preact/common/icon"

import { useApplicationAction, useEntryPoint } from "../../../../x_preact/common/hooks"

import { ApplicationError } from "../../../../x_preact/common/System/ApplicationError"

import { applicationPath } from "../../find_next/impl/helper"

import {
    FindNextVersionEntryPoint,
    FindNextVersionResource,
    FindNextVersionResourceState,
} from "../entry_point"

import { FindNextVersionError } from "../../find_next/data"

export function MoveToLatestVersion(entryPoint: FindNextVersionEntryPoint): VNode {
    const resource = useEntryPoint(entryPoint)

    const [err] = useErrorBoundary((err) => {
        // 認証前なのでエラーはどうしようもない
        console.log(err)
    })
    if (err) {
        return h(ApplicationError, { err: `${err}` })
    }

    return h(MoveToLatestVersionComponent, {
        ...resource,
        state: useApplicationAction(resource.findNext),
    })
}

export type MoveToLatestVersionProps = FindNextVersionResource & FindNextVersionResourceState
export function MoveToLatestVersionComponent(props: MoveToLatestVersionProps): VNode {
    useLayoutEffect(() => {
        switch (props.state.type) {
            case "succeed-to-find":
                // /index.html から呼び出されるので、最新かによらず
                // /${version}/index.html に遷移する
                location.href = applicationPath(props.state.version, props.state.target)
                break
        }
    }, [props.state])

    switch (props.state.type) {
        case "initial-next-version":
            return EMPTY_CONTENT

        case "delayed-to-find":
            return delayedMessage()

        case "succeed-to-find":
            // location の変更は useLayoutEffect で行うので中身は空
            return EMPTY_CONTENT

        case "failed-to-find":
            return h(ApplicationError, { err: errorMessage(props.state.err) })
    }

    function delayedMessage() {
        return loginBox(siteInfo(), {
            title: "アプリケーション読み込み中",
            body: [
                html`<p>${spinner} アプリケーションの読み込みに時間がかかっています</p>`,
                html`<p>
                    30秒以上かかるようであれば何かがおかしいので、<br />
                    お手数ですが、管理者にお伝えください
                </p>`,
            ],
            footer: "",
        })
    }
}

function errorMessage(err: FindNextVersionError): string {
    switch (err.err.type) {
        case "server-error":
            return "サーバーエラーが発生しました"

        case "infra-error":
            return `ネットワークエラーが発生しました: ${err.err.err}`
    }
}

const EMPTY_CONTENT = html``
