import { VNode } from "preact"
import { useState, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import {
    PasswordFieldComponentDeprecated,
    PasswordFieldComponentState,
    PasswordFieldComponentEventInit,
} from "../../../auth/field/password/action"

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

export function PasswordForm(
    formComponent: FormComponent,
    component: PasswordFieldComponentDeprecated,
    initEvent: PasswordFieldComponentEventInit,
): PreactComponent {
    return (props: Props): VNode => {
        const [state, setState] = useState(component.initialState)
        const event = initEvent(setState)

        useEffect(() => {
            if (props.initial.hasValue) {
                setInputValue("password", props.initial.value.inputValue)
                component.set(event, props.initial.value)
            }

            formComponent.onSubmit(() => component.validate(event))
        }, [])

        return html`
            <dl class="form ${state.result.valid ? "" : "form_error"}">
                <dt class="form__header"><label for="password">パスワード</label></dt>
                <dd class="form__field">
                    <input type="password" class="input_fill" id="password" onInput=${onInput}/>
                    ${error(state)}
                    <p class="form__help">${view(state.view)}</p>
                </dd>
            </dl>
        `

        function onInput(e: InputEvent) {
            if (e.target instanceof HTMLInputElement) {
                component.set(event, { inputValue: e.target.value })
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
                component.show(event)
            }
            function hide(e: MouseEvent) {
                linkClicked(e)
                component.hide(event)
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

function setInputValue(id: string, value: string): void {
    const input = document.getElementById(id)
    if (input instanceof HTMLInputElement) {
        input.value = value
    }
}
