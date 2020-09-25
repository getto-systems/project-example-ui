import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginIDFieldOperation, loginIDFieldError, onLoginIDInput } from "../../field/login_id"

import { LoginIDFieldState, initialLoginIDFieldState } from "../../../../auth/component/field/login_id/data"

interface PreactComponent {
    (): VNode
}

interface FormComponent {
    onLoginIDFieldStateChange(stateChanged: Post<LoginIDFieldState>): void
    trigger(operation: LoginIDFieldOperation): Promise<void>
}

export function LoginIDField(component: FormComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialLoginIDFieldState)

        useEffect(() => {
            component.onLoginIDFieldStateChange(setState)
        }, [])

        return html`
            <label>
                <dl class="form ${state.result.valid ? "" : "form_error"}">
                    <dt class="form__header">ログインID</dt>
                    <dd class="form__field">
                        <input type="text" class="input_fill" onInput=${onLoginIDInput(component)}/>
                        ${loginIDFieldError(state.result)}
                    </dd>
                </dl>
            </label>
        `
    }
}

interface Post<T> {
    (state: T): void
}
