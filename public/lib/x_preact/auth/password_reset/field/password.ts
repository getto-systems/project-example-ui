import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { PasswordFieldOperation, onPasswordInput, passwordView, passwordFieldError } from "../../field/password"

import { PasswordFieldState, initialPasswordFieldState } from "../../../../auth/field/password/data"

interface PreactComponent {
    (): VNode
}

interface FormComponent {
    onPasswordFieldStateChange(stateChanged: Dispatcher<PasswordFieldState>): void
    trigger(operation: PasswordFieldOperation): Promise<void>
}

export function PasswordField(component: FormComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialPasswordFieldState)

        useEffect(() => {
            component.onPasswordFieldStateChange(setState)
        }, [])

        return html`
            <label>
                <dl class="form ${state.result.valid ? "" : "form_error"}">
                    <dt class="form__header">パスワード</dt>
                    <dd class="form__field">
                        <input type="password" class="input_fill" onInput=${onPasswordInput(component)}/>
                        ${passwordFieldError(state.result, state.character)}
                        <p class="form__help">新しいパスワードを入力してください</p>
                        <p class="form__help">${passwordView(component, state.view, state.character)}</p>
                    </dd>
                </dl>
            </label>
        `
    }
}

interface Dispatcher<T> {
    (state: T): void
}
