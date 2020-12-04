import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    ExampleComponent,
    initialExampleState,
} from "../../../document/Dashboard/example/component"

import { Season, SeasonError } from "../../../common/season/data"
import { notice_alert, v_small } from "../../layout"

type Props = Readonly<{
    example: ExampleComponent
}>
export function Example({ example }: Props): VNode {
    const [state, setState] = useState(initialExampleState)
    useEffect(() => {
        example.onStateChange(setState)
        example.load()
    }, [])

    switch (state.type) {
        case "initial-example":
            return EMPTY_CONTENT

        case "succeed-to-load":
            return content(state.season)

        case "failed-to-load":
            return error(state.err)
    }
}

function content(season: Season): VNode {
    return html`
        <section class="box box_double">
            <div>
                <header class="box__header">${header}</header>
                <section class="box__body">${seasonForm(html`${season.year}`)}</section>
            </div>
        </section>
    `
}
function error(err: SeasonError): VNode {
    return html`
        <section class="box box_double">
            <div>
                <header class="box__header">${header}</header>
                <section class="box__body">
                    ${seasonForm(html`
                        ${notice_alert("ロードエラー")} ${v_small()}
                        <small><p>詳細: ${err.err}</p></small>
                    `)}
                </section>
            </div>
        </section>
    `
}

const header = html`<h2 class="box__title">GETTO Example</h2>`

function seasonForm(content: VNode): VNode {
    return html`
        <dl class="form">
            <dt class="form__header">シーズン</dt>
            <dd class="form__field">${content}</dd>
        </dl>
    `
}

const EMPTY_CONTENT = html``
