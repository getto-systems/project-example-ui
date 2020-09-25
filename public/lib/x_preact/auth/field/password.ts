import { VNode } from "preact"
import { html } from "htm/preact"

import { initInputValue, inputValueToString } from "../../../field/adapter"

import { PasswordFieldError, PasswordCharacter, PasswordView } from "../../../field/password/data"
import { InputValue, Valid } from "../../../field/data"

export type PasswordFieldOperation =
    Readonly<{ type: "field-password", operation: { type: "set-password", password: InputValue } }> |
    Readonly<{ type: "field-password", operation: { type: "show-password" } }> |
    Readonly<{ type: "field-password", operation: { type: "hide-password" } }>

export function onPasswordInput(component: FormComponent): Post<InputEvent> {
    return (e: InputEvent): void => {
        if (e.target instanceof HTMLInputElement) {
            setPassword(component, initInputValue(e.target.value))
        }
    }
}

export function passwordFieldError(result: Valid<PasswordFieldError>, character: PasswordCharacter): VNode[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return html`<p class="form__message">パスワードを入力してください</p>`

            case "too-long":
                if (character.complex) {
                    return html`<p class="form__message">パスワードが長すぎます(18文字程度)</p>`
                } else {
                    return html`<p class="form__message">パスワードが長すぎます(72文字以内)</p>`
                }
        }
    })
}

export function passwordView(component: FormComponent, view: PasswordView, character: PasswordCharacter): VNode {
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

    function extractPassword(inputValue: InputValue): string {
        const password = inputValueToString(inputValue)
        if (password.length === 0) {
            return "(入力されていません)"
        } else {
            return password
        }
    }

    function characterHelp(): string {
        if (character.complex) {
            return "(マルチバイト文字が含まれています)"
        } else {
            return ""
        }
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

interface FormComponent {
    trigger(operation: PasswordFieldOperation): Promise<void>
}

interface Post<T> {
    (state: T): void
}
