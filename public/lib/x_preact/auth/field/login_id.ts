import { VNode } from "preact"
import { html } from "htm/preact"

import { packInputValue } from "../../../field/adapter"

import { LoginIDFieldError } from "../../../field/login_id/data"
import { InputValue, Valid } from "../../../field/data"

export type LoginIDFieldOperation =
    Readonly<{ type: "field-login_id", operation: { type: "set-login_id", loginID: InputValue } }>

export function loginIDFieldError(result: Valid<LoginIDFieldError>): VNode[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return html`<p class="form__message">ログインIDを入力してください</p>`
        }
    })
}

export function onLoginIDInput(component: FormComponent): Post<InputEvent> {
    return (e: InputEvent): void => {
        if (e.target instanceof HTMLInputElement) {
            setLoginID(component, packInputValue(e.target.value))
        }
    }
}

function setLoginID(component: FormComponent, loginID: InputValue): void {
    component.trigger({ type: "field-login_id", operation: { type: "set-login_id", loginID } })
}

interface FormComponent {
    trigger(operation: LoginIDFieldOperation): Promise<void>
}

interface Post<T> {
    (state: T): void
}
