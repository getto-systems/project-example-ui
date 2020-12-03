import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { loginIDFieldError, loginIDFieldHandler } from "../field/login_id"

import {
    LoginIDFieldComponent,
    initialLoginIDFieldState,
} from "../../../auth/login/Login/field/login_id/component"

type ComponentSet = Readonly<{
    loginIDField: LoginIDFieldComponent
}>
export function LoginIDField({ loginIDField }: ComponentSet): VNode {
    const [state, setState] = useState(initialLoginIDFieldState)
    useEffect(() => {
        loginIDField.onStateChange(setState)
    }, [])

    const handler = loginIDFieldHandler(loginIDField)

    return html`
        <label>
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header">ログインID</dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" onInput=${handler.onInput} />
                    ${loginIDFieldError(state.result)}
                </dd>
            </dl>
        </label>
    `
}
