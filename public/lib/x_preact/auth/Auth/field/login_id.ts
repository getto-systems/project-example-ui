import { VNode } from "preact"
import { html } from "htm/preact"

import { mapInputEvent } from "./common"

import { LoginIDFieldComponent } from "../../../../auth/Auth/field/login_id/component"

import { LoginIDFieldError } from "../../../../auth/common/field/login_id/data"
import { Valid } from "../../../../auth/common/field/data"

export interface LoginIDFieldHandler {
    onInput(event: InputEvent): void
}

export function loginIDFieldHandler(loginIDField: LoginIDFieldComponent): LoginIDFieldHandler {
    return {
        onInput: mapInputEvent((loginID) => {
            loginIDField.set(loginID)
        }),
    }
}

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
