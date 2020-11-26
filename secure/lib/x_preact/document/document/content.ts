import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ContentComponent, initialContentState } from "../../../Document/component/content/component"

type Props = Readonly<{
    content: ContentComponent
}>
export function Content({ content }: Props): VNode {
    const [state, setState] = useState(initialContentState)
    useEffect(() => {
        content.onStateChange(setState)
    }, [])

    switch (state.type) {
        case "initial-content":
            return document()
    }
}

function document(): VNode {
    return html`
        <section class="box box_double">
            <div>
                <header class="box__header"><h2 class="box__title">GETTO Document</h2></header>
                <section class="box__body">ここにコンテンツ</section>
            </div>
        </section>
    `
}
