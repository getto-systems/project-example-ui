import { VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../z_vendor/getto-css/preact/common"

import { mapInputEvent } from "./common"

import { LoginIDFieldComponent } from "../../../../auth/Auth/field/loginID/component"

import { FormValidationResult } from "../../../../sub/getto-form/action/data"
import { LoginIDValidationError } from "../../../../auth/common/field/loginID/data"
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

export function loginIDFieldError(result: Valid<LoginIDValidationError>): VNode[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return html`<p class="form__notice">ログインIDを入力してください</p>`
        }
    })
}

export function loginIDValidationError(result: FormValidationResult<LoginIDValidationError>): VNodeContent[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return ["ログインIDを入力してください"]
        }
    })
}
