import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { ExampleComponent, initialExampleState } from "../../../home/component/example/component"

import { Season } from "../../../season/data"

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
    }
}

function content(season: Season): VNode {
    const { year } = season

    return html`
        <section class="box box_double">
            <div>
                <header class="box__header">
                    <h2 class="box__title">GETTO Example</h2>
                </header>
                <section class="box__body">
                    <dl class="form">
                        <dt class="form__header">シーズン</dt>
                        <dd class="form__field">${year}</dd>
                    </dl>
                    <dl class="form">
                        <dt class="form__header">バージョン</dt>
                        <dd class="form__field">さいしん！</dd>
                    </dl>
                </section>
            </div>
            <footer class="box__footer">
                <section class="button__container">
                    <a class="#">リンク</a>
                </section>
            </footer>
        </section>
    `
}

const EMPTY_CONTENT = html``
