import { h, VNode } from "preact"

import {
    field,
    field_error,
    label_password_fill,
} from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"
import { FormInput } from "../../../common/form/FormInput"

import { passwordView, passwordValidationError } from "../field/password"

import {
    initialPasswordFormFieldState,
    PasswordFormFieldComponent,
} from "../../../../auth/Auth/field/password/component"

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
