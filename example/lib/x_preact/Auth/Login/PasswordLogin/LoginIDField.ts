import { h, VNode } from "preact"
import { html } from "htm/preact"

import { field, field_error, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"

import { loginIDFieldError, loginIDFieldHandler, loginIDValidationError } from "../field/loginID"

import {
    LoginIDFieldComponent,
    initialLoginIDFieldState,
} from "../../../../auth/Auth/field/loginID/component"
import { LoginIDFormFieldComponent } from "../../../../auth/Auth/passwordLogin/component"
import { initialFormFieldComponentState } from "../../../../sub/getto-form/component/component"
import { FormInput } from "../../../common/form/FormInput"

// TODO LoginIDFormField -> LoginIDField
type Props = Readonly<{
    loginID: LoginIDFormFieldComponent
}>
export function LoginIDFormField({ loginID }: Props): VNode {
    const state = useComponent(loginID, initialFormFieldComponentState)

    return label_text_fill(content())

    // TODO Login / Reset / ResetSession はおそらく help の違いのみなので props で help を渡してはどうか
    function content() {
        const content = {
            title: "ログインID",
            body: h(FormInput, { type: "text", input: loginID.input }),
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDValidationError(state.result) })
        }
    }
}

// TODO 以下削除
type FieldProps = Readonly<{
    loginIDField: LoginIDFieldComponent
}>
export function LoginIDField({ loginIDField }: FieldProps): VNode {
    const state = useComponent(loginIDField, initialLoginIDFieldState)

    return label_text_fill(content())

    function content() {
        const { onInput } = loginIDFieldHandler(loginIDField)

        const content = {
            title: "ログインID",
            body: html`<input type="text" onInput=${onInput} />`,
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDFieldError(state.result) })
        }
    }
}
