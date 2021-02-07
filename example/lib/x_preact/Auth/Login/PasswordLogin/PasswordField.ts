import { h, VNode } from "preact"
import { html } from "htm/preact"

import {
    field,
    field_error,
    label_password_fill,
} from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"

import {
    passwordView,
    passwordFieldError,
    passwordFieldHandler,
    passwordValidationError,
} from "../field/password"

import {
    PasswordFieldComponent,
    initialPasswordFieldState,
} from "../../../../auth/Auth/field/password/component"
import {
    initialPasswordFormFieldState,
    PasswordFormFieldComponent,
} from "../../../../auth/Auth/passwordLogin/component"
import { FormInput } from "../../../common/form/FormInput"

type Props = Readonly<{
    password: PasswordFormFieldComponent
}>
export function PasswordFormField({ password }: Props): VNode {
    const state = useComponent(password, initialPasswordFormFieldState)

    return label_password_fill(content())

    function content() {
        const handler = {
            show: () => password.show(),
            hide: () => password.hide(),
        }

        const content = {
            title: "パスワード",
            body: h(FormInput, { type: "password", input: password.input }),
            help: [passwordView(handler, state.view, state.character)],
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(state.result, state.character),
            })
        }
    }
}

// TODO 以下削除
type FieldProps = Readonly<{
    passwordField: PasswordFieldComponent
}>
export function PasswordField({ passwordField }: FieldProps): VNode {
    const state = useComponent(passwordField, initialPasswordFieldState)

    return label_password_fill(content())

    function content() {
        const handler = passwordFieldHandler(passwordField)

        const content = {
            title: "パスワード",
            body: html`<input type="password" onInput=${handler.onInput} />`,
            help: [passwordView(handler, state.view, state.character)],
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: passwordFieldError(state.result, state.character) })
        }
    }
}
