import { VNode } from "preact"
import { useState, useRef, useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { initInputValue, inputValueToString } from "../../../field/adapter"

import { PasswordFieldComponentState, initialPasswordFieldComponentState } from "../../../auth/field/password/data"

import { PasswordView } from "../../../field/password/data"
import { InputValue } from "../../../field/data"

interface PreactComponent {
    (): VNode
}

interface FormComponent {
    initPasswordField(stateChanged: Publisher<PasswordFieldComponentState>): void
    trigger(operation: FieldOperation): Promise<void>
}

type FieldOperation =
    Readonly<{ type: "field-password", operation: { type: "set-password", password: InputValue } }> |
    Readonly<{ type: "field-password", operation: { type: "show-password" } }> |
    Readonly<{ type: "field-password", operation: { type: "hide-password" } }>

export function PasswordField(component: FormComponent): PreactComponent {
    return (): VNode => {
        const [state, setState] = useState(initialPasswordFieldComponentState)
        const input = useRef<HTMLInputElement>()

        useEffect(() => {
            component.initPasswordField(setState)
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
                setPassword(component, initInputValue(e.target.value))
            }
        }

        function error(state: PasswordFieldComponentState): VNode[] {
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
                showPassword(component)
            }
            function hide(e: MouseEvent) {
                linkClicked(e)
                hidePassword(component)
            }
            function linkClicked(e: MouseEvent) {
                e.preventDefault()

                // クリック後 focus 状態になるのでキャンセル
                if (e.target instanceof HTMLElement) {
                    e.target.blur()
                }
            }

            function extractPassword(inputValue: InputValue): string {
                const password = inputValueToString(inputValue)
                if (password.length === 0) {
                    return "(入力されていません)"
                } else {
                    return password
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

function setPassword(component: FormComponent, password: InputValue): void {
    component.trigger({ type: "field-password", operation: { type: "set-password", password } })
}
function showPassword(component: FormComponent): void {
    component.trigger({ type: "field-password", operation: { type: "show-password" } })
}
function hidePassword(component: FormComponent): void {
    component.trigger({ type: "field-password", operation: { type: "hide-password" } })
}

interface Publisher<T> {
    (state: T): void
}
