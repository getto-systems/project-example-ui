import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { passwordView, passwordFieldError, passwordFieldHandler } from "../../field/password"

import {
    PasswordFieldComponent,
    initialPasswordFieldState,
} from "../../../../auth/component/field/password/component"

type ComponentSet = Readonly<{
    passwordField: PasswordFieldComponent
}>
export function PasswordField({ passwordField }: ComponentSet): VNode {
    const [state, setState] = useState(initialPasswordFieldState)
    useEffect(() => {
        passwordField.onStateChange(setState)
    }, [])

    const handler = passwordFieldHandler(passwordField)

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">パスワード</dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" onInput=${handler.onInput} />
                    ${passwordFieldError(state.result, state.character)}
                    <p class="form__help">新しいパスワードを入力してください</p>
                    <p class="form__help">${passwordView(handler, state.view, state.character)}</p>
                </dd>
            </dl>
        </label>
    `
}
