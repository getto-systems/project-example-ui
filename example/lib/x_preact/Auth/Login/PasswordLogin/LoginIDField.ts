import { h, VNode } from "preact"

import { field, field_error, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"
import { FormInput } from "../../../common/form/FormInput"

import { loginIDValidationError } from "../field/loginID"

import { LoginIDFormFieldComponent } from "../../../../auth/Auth/field/loginID/component"
import { initialFormFieldComponentState } from "../../../../sub/getto-form/component/component"

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
