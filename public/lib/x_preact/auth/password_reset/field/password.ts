import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { mapInputEvent } from "../../field/common"
import { passwordView, passwordFieldError } from "../../field/password"

import { PasswordFieldState, initialPasswordFieldState } from "../../../../auth/component/field/password/component"

import { PasswordFieldOperation } from "../../../../password/field/data"

type Props = Readonly<{
    component: FormComponent
    request: { (operation: { type: "field-password", operation: PasswordFieldOperation }): void }
}>

interface FormComponent {
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
}

export function PasswordField(props: Props): VNode {
    const [state, setState] = useState(initialPasswordFieldState)
    useEffect(() => {
        props.component.onPasswordFieldStateChange(setState)
    }, [])

    const onInput = mapInputEvent((password) => {
        props.request({ type: "field-password", operation: { type: "set-password", password } })
    })

    const handler = {
        show() {
            props.request({ type: "field-password", operation: { type: "show-password" } })
        },
        hide() {
            props.request({ type: "field-password", operation: { type: "hide-password" } })
        },
    }

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">パスワード</dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" onInput=${onInput}/>
                    ${passwordFieldError(state.result, state.character)}
                    <p class="form__help">新しいパスワードを入力してください</p>
                    <p class="form__help">${passwordView(handler, state.view, state.character)}</p>
                </dd>
            </dl>
        </label>
    `
}

interface Post<T> {
    (state: T): void
}
