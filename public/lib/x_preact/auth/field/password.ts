import { VNode } from "preact"
import { html } from "htm/preact"

import { mapInputEvent } from "./common"

import { PasswordFieldComponent } from "../../../auth/component/field/password/component"

import { PasswordFieldError, PasswordCharacter, PasswordView } from "../../../password/field/data"
import { InputValue, Valid } from "../../../field/data"

export interface PasswordFieldHandler {
    onInput(event: InputEvent): void
    show(): void
    hide(): void
}

export function passwordFieldHandler(passwordField: PasswordFieldComponent): PasswordFieldHandler {
    return {
        onInput: mapInputEvent((password) => {
            passwordField.set(password)
        }),
        show() {
            passwordField.show()
        },
        hide() {
            passwordField.hide()
        },
    }
}

export function passwordFieldError(
    result: Valid<PasswordFieldError>,
    character: PasswordCharacter
): VNode[] {
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

export interface PasswordViewHandler {
    show(): void
    hide(): void
}

export function passwordView(
    handler: PasswordViewHandler,
    view: PasswordView,
    character: PasswordCharacter
): VNode {
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

    function extractPassword(password: InputValue): string {
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
        handler.show()
    }
    function hide(e: MouseEvent) {
        linkClicked(e)
        handler.hide()
    }
    function linkClicked(e: MouseEvent) {
        e.preventDefault()

        // クリック後 focus 状態になるのでキャンセル
        if (e.target instanceof HTMLElement) {
            e.target.blur()
        }
    }
}

interface Post<T> {
    (state: T): void
}
