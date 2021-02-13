import { h, VNode } from "preact"

import { VNodeContent } from "../../../../z_vendor/getto-css/preact/common"
import { field, field_error, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"

import { FormInput } from "../../../common/Form/FormInput"

import { LoginIDFormFieldComponent } from "../../../../auth/x_Resource/common/Field/LoginID/component"
import { initialFormFieldComponentState } from "../../../../common/getto-form/x_Resource/Form/component"

import { FormValidationResult } from "../../../../common/getto-form/form/data"
import { LoginIDValidationError } from "../../../../auth/common/field/loginID/data"

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

function loginIDValidationError(result: FormValidationResult<LoginIDValidationError>): VNodeContent[] {
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
