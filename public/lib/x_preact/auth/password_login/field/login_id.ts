import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { onFieldInput } from "../../field/common"
import { loginIDFieldError } from "../../field/login_id"

import { LoginIDFieldState, initialLoginIDFieldState } from "../../../../auth/component/field/login_id/component"

import { LoginIDFieldOperation } from "../../../../field/login_id/data"

type Props = Readonly<{
    component: FormComponent
}>

interface FormComponent {
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    trigger(operation: { type: "field-login_id", operation: LoginIDFieldOperation }): Promise<void>
}

export function LoginIDField(props: Props): VNode {
    const [state, setState] = useState(initialLoginIDFieldState)
    useEffect(() => {
        props.component.onLoginIDFieldStateChange(setState)
    }, [])

    const onInput = onFieldInput((loginID) => {
        props.component.trigger({ type: "field-login_id", operation: { type: "set-login_id", loginID } })
    })

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">ログインID</dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" onInput=${onInput}/>
                    ${loginIDFieldError(state.result)}
                </dd>
            </dl>
        </label>
    `
}

interface Post<T> {
    (state: T): void
}
