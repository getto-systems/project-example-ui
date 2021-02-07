import { VNode } from "preact"
import { html } from "htm/preact"

import { mapInputEvent } from "./common"

import { LoginIDFieldComponent } from "../../../../auth/Auth/field/loginID/component"

import { LoginIDFieldError } from "../../../../auth/common/field/loginID/data"
import { Valid } from "../../../../auth/common/field/data"
import { FormValidationResult } from "../../../../sub/getto-form/data"
import { VNodeContent } from "../../../../z_vendor/getto-css/preact/common"

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
                return html`<p class="form__notice">ログインIDを入力してください</p>`
        }
    })
}

export function loginIDValidationError(result: FormValidationResult<LoginIDFieldError>): VNodeContent[] {
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
