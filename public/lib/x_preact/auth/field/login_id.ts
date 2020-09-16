import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    LoginIDFieldComponent,
    LoginIDFieldComponentState,
    initialLoginIDFieldComponentState,
} from "../../../auth/field/login_id/data"

import { InitialValue } from "../../../field/data"

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

export function LoginIDField(
    formComponent: FormComponent,
    component: LoginIDFieldComponent,
): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(initialLoginIDFieldComponentState)
        const input = useRef<HTMLInputElement>()

        useEffect(() => {
            component.init(setState)

            if (props.initial.hasValue) {
                if (input.current) {
                    input.current.value = props.initial.value.inputValue
                }
                component.field.set(props.initial.value)
            }

            formComponent.onSubmit(async () => component.field.validate())

            return () => component.terminate()
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
