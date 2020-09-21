import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { initInputValue } from "../../../field/adapter"

import { LoginIDFieldComponentState, initialLoginIDFieldComponentState } from "../../../auth/field/login_id/data"

import { InputValue } from "../../../field/data"

interface PreactComponent {
    (): VNode
}

interface FormComponent {
    initLoginIDField(stateChanged: Publisher<LoginIDFieldComponentState>): void
    trigger(operation: FieldOperation): Promise<void>
}

type FieldOperation =
    Readonly<{ type: "field-login_id", operation: { type: "set-login_id", loginID: InputValue } }>

export function LoginIDField(component: FormComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialLoginIDFieldComponentState)
        const input = useRef<HTMLInputElement>()

        useEffect(() => {
            component.initLoginIDField(setState)
        }, [])

        return html`
            <label>
                <dl class="form ${state.result.valid ? "" : "form_error"}">
                    <dt class="form__header">ログインID</dt>
                    <dd class="form__field">
                        <input type="text" class="input_fill" ref=${input} onInput=${onInput}/>
                        ${error(state)}
                    </dd>
                </dl>
            </label>
        `

        function onInput(e: InputEvent) {
            if (e.target instanceof HTMLInputElement) {
                setLoginID(component, initInputValue(e.target.value))
            }
        }

        function error(state: LoginIDFieldComponentState): Array<VNode> {
            if (state.result.valid) {
                return []
            }

            return state.result.err.map((err) => {
                switch (err) {
                    case "empty":
                        return html`<p class="form__message">ログインIDを入力してください</p>`
                }
            })
        }
    }
}

function setLoginID(component: FormComponent, loginID: InputValue): void {
    component.trigger({ type: "field-login_id", operation: { type: "set-login_id", loginID } })
}

interface Publisher<T> {
    (state: T): void
}
