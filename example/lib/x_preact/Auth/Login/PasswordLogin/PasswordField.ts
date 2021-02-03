import { VNode } from "preact"
import { html } from "htm/preact"

import {
    field,
    field_error,
    label_password_fill,
} from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"

import { passwordView, passwordFieldError, passwordFieldHandler } from "../field/password"

import {
    PasswordFieldComponent,
    initialPasswordFieldState,
} from "../../../../auth/Auth/field/password/component"

type Props = Readonly<{
    passwordField: PasswordFieldComponent
}>
export function PasswordField({ passwordField }: Props): VNode {
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
