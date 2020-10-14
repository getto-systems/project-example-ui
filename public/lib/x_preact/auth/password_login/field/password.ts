import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { mapInputEvent } from "../../field/common"
import { passwordView, passwordFieldError } from "../../field/password"

import { PasswordFieldComponent, initialPasswordFieldState } from "../../../../auth/component/field/password/component"

type ComponentSet = Readonly<{
    passwordField: PasswordFieldComponent
}>

type Props = Readonly<{
    components: ComponentSet
}>
export function PasswordField({ components: { passwordField } }: Props): VNode {
    const [state, setState] = useState(initialPasswordFieldState)
    useEffect(() => {
        passwordField.onStateChange(setState)
    }, [])

    const onInput = mapInputEvent((password) => {
        passwordField.action({ type: "set", inputValue: password })
    })

    const handler = {
        show() {
            passwordField.action({ type: "show" })
        },
        hide() {
            passwordField.action({ type: "hide" })
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
