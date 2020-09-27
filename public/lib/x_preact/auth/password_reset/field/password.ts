import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { PasswordFieldOperation, password, onPasswordInput, passwordView, passwordFieldError } from "../../field/password"

import { PasswordFieldState, initialPasswordFieldState } from "../../../../auth/component/field/password/component"

type Props = Readonly<{
    component: FormComponent
}>

interface FormComponent {
    onPasswordFieldStateChange(stateChanged: Post<PasswordFieldState>): void
    trigger(operation: PasswordFieldOperation): Promise<void>
}

export function PasswordField(props: Props): VNode {
    const [state, setState] = useState(initialPasswordFieldState)
    useEffect(() => {
        props.component.onPasswordFieldStateChange(setState)
    }, [])

    const value = password(state)
    const onInput = onPasswordInput(props.component)

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">パスワード</dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" value=${value} onInput=${onInput}/>
                    ${passwordFieldError(state.result, state.character)}
                    <p class="form__help">新しいパスワードを入力してください</p>
                    <p class="form__help">${passwordView(props.component, state.view, state.character)}</p>
                </dd>
            </dl>
        </label>
    `
}

interface Post<T> {
    (state: T): void
}
