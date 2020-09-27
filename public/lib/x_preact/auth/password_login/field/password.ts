import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { onFieldInput } from "../../field/common"
import { passwordView, passwordFieldError } from "../../field/password"

import { PasswordFieldState, initialPasswordFieldState } from "../../../../auth/component/field/password/component"

import { PasswordFieldOperation } from "../../../../field/password/data"

type Props = Readonly<{
    component: FormComponent
}>

interface FormComponent {
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
    trigger(operation: { type: "field-password", operation: PasswordFieldOperation }): Promise<void>
}

export function PasswordField(props: Props): VNode {
    const [state, setState] = useState(initialPasswordFieldState)
    useEffect(() => {
        props.component.onPasswordFieldStateChange(setState)
    }, [])

    const onInput = onFieldInput((password) => {
        props.component.trigger({ type: "field-password", operation: { type: "set-password", password } })
    })

    const handler = {
        show() {
            props.component.trigger({ type: "field-password", operation: { type: "show-password" } })
        },
        hide() {
            props.component.trigger({ type: "field-password", operation: { type: "hide-password" } })
        },
    }

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">パスワード</dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" onInput=${onInput}/>
                    ${passwordFieldError(state.result, state.character)}
                    <p class="form__help">${passwordView(handler, state.view, state.character)}</p>
                </dd>
            </dl>
        </label>
    `
}

interface Post<T> {
    (state: T): void
}
