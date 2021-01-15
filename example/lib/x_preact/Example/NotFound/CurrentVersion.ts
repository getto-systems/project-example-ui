import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { fullScreenError } from "../../common/layout"

import {
    CurrentVersionComponent,
    initialCurrentVersionState,
} from "../../../example/NotFound/currentVersion/component"
import { Version } from "../../../example/shared/currentVersion/data"

type Props = Readonly<{
    currentVersion: CurrentVersionComponent
}>
export function CurrentVersion({ currentVersion }: Props): VNode {
    const [state, setState] = useState(initialCurrentVersionState)
    useEffect(() => {
        currentVersion.onStateChange(setState)
        currentVersion.load()
    }, [])

    switch (state.type) {
        case "initial-current-version":
            return EMPTY_CONTENT

        case "succeed-to-find":
            return content(state.version)
    }
}

function content(version: Version): VNode {
    return fullScreenError(
        "見つかりませんでした",
        [
            html`<p>リンクされたページは存在しません</p>`,
            html`<p>お手数ですが、管理者にクリックしたリンクをお伝えください</p>`,
        ],
        html`<section class="button__container">
            <div></div>
            <div class="login__link">
                <a href="/${version}/index.html"><i class="lnir lnir-home"></i> ホームへ</a>
            </div>
        </section>`
    )
}

const EMPTY_CONTENT = html``
