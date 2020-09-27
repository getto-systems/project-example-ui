import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginIDFieldOperation, loginID, loginIDFieldError, onLoginIDInput } from "../../field/login_id"

import { LoginIDFieldState, initialLoginIDFieldState } from "../../../../auth/component/field/login_id/component"

type Props = Readonly<{
    component: FormComponent
}>

interface FormComponent {
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    trigger(operation: LoginIDFieldOperation): Promise<void>
}

export function LoginIDField(props: Props): VNode {
    const [state, setState] = useState(initialLoginIDFieldState)
    useEffect(() => {
        props.component.onLoginIDFieldStateChange(setState)
    }, [])

    const value = loginID(state)
    const onInput = onLoginIDInput(props.component)

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">ログインID</dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" value=${value} onInput=${onInput}/>
                    ${loginIDFieldError(state.result)}
                    <p class="form__help">このログインIDに設定された送信先にリセットトークンを送信します</p>
                </dd>
            </dl>
        </label>
    `
}

interface Post<T> {
    (state: T): void
}
