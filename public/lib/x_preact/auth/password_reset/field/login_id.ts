import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { mapInputEvent, mapInputValue } from "../../field/common"
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
    const [value, setValue] = mapSetter(useState(""), mapInputValue)
    useEffect(() => {
        props.component.onLoginIDFieldStateChange(setState)
    }, [])

    const onInput = mapInputEvent((loginID) => {
        props.component.trigger({ type: "field-login_id", operation: { type: "set-login_id", loginID } })
        setValue(loginID)
    })

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">ログインID</dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" value=${value} onInput=${onInput}/>
                    ${loginIDFieldError(state.result)}
                    <p class="form__help">最初に入力したログインIDを入力してください</p>
                </dd>
            </dl>
        </label>
    `
}

interface Post<T> {
    (state: T): void
}

function mapSetter<A, B, B_>(tuple: [A, B], f: Transform<B, B_>): [A, B_] {
    const [first, second] = tuple
    return [first, f(second)]
}

interface Transform<A, B> {
    (data: A): B
}
