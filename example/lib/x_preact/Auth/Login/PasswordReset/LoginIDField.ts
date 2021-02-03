import { VNode } from "preact"
import { html } from "htm/preact"

import { field, field_error, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { loginIDFieldError, loginIDFieldHandler } from "../field/loginID"

import {
    LoginIDFieldComponent,
    initialLoginIDFieldState,
} from "../../../../auth/Auth/field/loginID/component"
import { useComponent } from "../../../common/hooks"

type Props = Readonly<{
    loginIDField: LoginIDFieldComponent
}>
export function LoginIDField({ loginIDField }: Props): VNode {
    const state = useComponent(loginIDField, initialLoginIDFieldState)

    return label_text_fill(content())

    function content() {
        const { onInput } = loginIDFieldHandler(loginIDField)

        const content = {
            title: "ログインID",
            body: html`<input type="text" onInput=${onInput} />`,
            help: ["最初に入力したログインIDを入力してください"],
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDFieldError(state.result) })
        }
    }
}
