import { h, VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../z_vendor/getto-css/preact/common"
import { field, field_error, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"

import { FormInput } from "../../../common/form/FormInput"

import { mapInputEvent } from "./common"

import {
    LoginIDFieldComponent,
    LoginIDFormFieldComponent,
} from "../../../../auth/Auth/field/loginID/component"
import { initialFormFieldComponentState } from "../../../../sub/getto-form/component/component"

import { FormValidationResult } from "../../../../sub/getto-form/action/data"
import { LoginIDValidationError } from "../../../../auth/common/field/loginID/data"
import { Valid } from "../../../../auth/common/field/data"

type Props = Readonly<{
    loginID: LoginIDFormFieldComponent
    help: VNodeContent[]
}>
export function LoginIDFormField({ loginID, help }: Props): VNode {
    const state = useComponent(loginID, initialFormFieldComponentState)

    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(FormInput, { type: "text", input: loginID.input }),
            help,
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDValidationError(state.result) })
        }
    }
}

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

export function loginIDValidationError(
    result: FormValidationResult<LoginIDValidationError>
): VNodeContent[] {
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
