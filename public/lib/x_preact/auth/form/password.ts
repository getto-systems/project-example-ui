import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    PasswordFieldComponent,
    PasswordFieldComponentState,
    initialPasswordFieldComponentState,
} from "../../../auth/field/password/data"

import { PasswordView } from "../../../field/password/data"
import { InputValue, InitialValue } from "../../../input/data"

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

export function PasswordForm(formComponent: FormComponent, component: PasswordFieldComponent): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(initialPasswordFieldComponentState)
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
        }, [])

        return html`
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header"><label for="password">パスワード</label></dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" ref="${input}" onInput=${onInput}/>
                    ${error(state)}
                    <p class="form__help">${view(state.view)}</p>
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            if (e.target instanceof HTMLInputElement) {
                component.field.set({ inputValue: e.target.value })
            }
        }

        function error(state: PasswordFieldComponentState): Array<VNode> {
            if (state.result.valid) {
                return []
            }

            return state.result.err.map((err) => {
                switch (err) {
                    case "empty":
                        return html`<p class="form__message">パスワードを入力してください</p>`

                    case "too-long":
                        if (state.character.complex) {
                            return html`<p class="form__message">パスワードが長すぎます(18文字程度)</p>`
                        } else {
                            return html`<p class="form__message">パスワードが長すぎます(72文字以内)</p>`
                        }
                }
            })
        }

        function view(view: PasswordView): VNode {
            if (view.show) {
                return html`
                    <a href="#" onClick=${hide}>
                        <i class="lnir lnir-key-alt"></i> パスワードを隠す ${characterHelp()}
                    </a>
                    <p class="form__help">${extractPassword(view.password)}</p>
                `
            } else {
                return html`
                    <a href="#" onClick=${show}>
                        <i class="lnir lnir-key-alt"></i> パスワードを表示 ${characterHelp()}
                    </a>
                `
            }

            function show(e: MouseEvent) {
                linkClicked(e)
                component.field.show()
            }
            function hide(e: MouseEvent) {
                linkClicked(e)
                component.field.hide()
            }
            function linkClicked(e: MouseEvent) {
                e.preventDefault()

                // クリック後 focus 状態になるのでキャンセル
                if (e.target instanceof HTMLElement) {
                    e.target.blur()
                }
            }

            function extractPassword(password: InputValue): string {
                if (password.inputValue.length === 0) {
                    return "(入力されていません)"
                } else {
                    return password.inputValue
                }
            }
        }

        function characterHelp(): string {
            if (state.character.complex) {
                return "(マルチバイト文字が含まれています)"
            } else {
                return ""
            }
        }
    }
}
