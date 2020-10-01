import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    ExampleComponent,
    ExampleParam,
    initialExampleState,
    initialExampleRequest,
} from "../../../home/component/example/component"

type Props = Readonly<{
    component: ExampleComponent
    param: ExampleParam
}>

export function Example(props: Props): VNode {
    const [state, setState] = useState(initialExampleState)
    const [_request, setRequest] = useState(() => initialExampleRequest)
    useEffect(() => {
        props.component.onStateChange(setState)

        const resource = props.component.init()
        setRequest(() => resource.request)
        resource.request({ type: "set-param", param: props.param })

        return resource.terminate
    }, [])

    switch (state.type) {
        case "initial-example":
            return content()

        case "error":
            // TODO スタイルをつける
            return html`えらーだ！`
    }
}

function content(): VNode {
    return html`
        <section class="box box_double">
            <div>
                <header class="box__header">
                    <h2 class="box__title">GETTO Example</h2>
                </header>
                <section class="box__body">
                    <dl class="form">
                        <dt class="form__header">バージョン</dt>
                        <dd class="form__field">
                            さいしん！
                        </dd>
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
