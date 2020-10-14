import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { mapInputEvent } from "../../field/common"
import { loginIDFieldError } from "../../field/login_id"

import { LoginIDFieldComponent, initialLoginIDFieldState } from "../../../../auth/component/field/login_id/component"

type ComponentSet = Readonly<{
    loginIDField: LoginIDFieldComponent
}>

type Props = Readonly<{
    components: ComponentSet
}>
export function LoginIDField({ components: { loginIDField } }: Props): VNode {
    const [state, setState] = useState(initialLoginIDFieldState)
    useEffect(() => {
        loginIDField.onStateChange(setState)
    }, [])

    const onInput = mapInputEvent((loginID) => {
        loginIDField.action({ type: "set", inputValue: loginID })
    })

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">ログインID</dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" onInput=${onInput}/>
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
