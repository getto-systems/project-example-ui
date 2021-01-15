import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { fullScreenError, v_medium } from "../common/layout"

import { ApplicationError } from "../common/System/ApplicationError"

import { NextVersionResource } from "../../update/Update/MoveToNextVersion/view"
import { initialNextVersionState } from "../../update/Update/nextVersion/component"

import { appTargetToPath, FindError } from "../../update/nextVersion/data"

type Props = NextVersionResource
export function NextVersion({ nextVersion }: Props): VNode {
    const [state, setState] = useState(initialNextVersionState)
    useEffect(() => {
        nextVersion.onStateChange(setState)
        nextVersion.find()
    }, [])

    useEffect(() => {
        switch (state.type) {
            case "succeed-to-find":
                // /index.html から呼び出されるはずなので、最新かによらず
                // /${version}/index.html に遷移する
                location.href = appTargetToPath(state.target)
                break
        }
    }, [state])

    switch (state.type) {
        case "initial-next-version":
            return EMPTY_CONTENT

        case "delayed-to-find":
            return delayedContent()

        case "succeed-to-find":
            // location の変更は useEffect で行うので中身は空
            return EMPTY_CONTENT

        case "failed-to-find":
            return failedContent(state.err)
    }

    function delayedContent() {
        return fullScreenError(
            "アプリケーションの読み込みに時間がかかっています",
            html`
                <p><i class="lnir lnir-spinner lnir-is-spinning"></i> 読み込み中です</p>
                ${v_medium()}
                <p>
                    30秒以上かかるようであれば何かがおかしいので、<br />
                    お手数ですが管理者に連絡してください
                </p>
            `,
            ""
        )
    }

    function failedContent(err: FindError) {
        return h(ApplicationError, { err: errorMessage() })

        function errorMessage() {
            switch (err.err.type) {
                case "server-error":
                    return "コンテンツを取得できませんでした"

                case "infra-error":
                    return `ネットワークエラーが発生しました: ${err.err.err}`
            }
        }
    }
}

const EMPTY_CONTENT = html``
