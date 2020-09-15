import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { LoginIDFieldComponent } from "../../../auth/field/login_id/action"
import { LoginIDFieldComponentState, initialLoginIDFieldComponentState } from "../../../auth/field/login_id/data"

import { InitialValue } from "../../../input/data"

interface PreactComponent {
    (props: Props): VNode
}

type Props = {
    initial: InitialValue,
}

interface FormComponent {
    onSubmit(handler: SubmitHandler): void
}

interface SubmitHandler {
    (): Promise<void>
}

export function LoginIDForm(
    formComponent: FormComponent,
    component: LoginIDFieldComponent,
): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(initialLoginIDFieldComponentState)
        component.init(setState)

        useEffect(() => {
            if (props.initial.hasValue) {
                setInputValue("login-id", props.initial.value.inputValue)
                component.field.set(props.initial.value)
            }

            formComponent.onSubmit(() => component.field.validate())
        }, [])

        return html`
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header"><label for="login-id">ログインID</label></dt>
                <dd class="form__field">
                    <input type="text" class="input_fill" id="login-id" onInput=${onInput}/>
                    ${error(state)}
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            if (e.target instanceof HTMLInputElement) {
                component.field.set({ inputValue: e.target.value })
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

function setInputValue(id: string, value: string): void {
    const input = document.getElementById(id)
    if (input instanceof HTMLInputElement) {
        input.value = value
    }
}
