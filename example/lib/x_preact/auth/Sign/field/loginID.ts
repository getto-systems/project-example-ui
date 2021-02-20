import { h, VNode } from "preact"

import { VNodeContent } from "../../../../z_vendor/getto-css/preact/common"
import { field, field_error, label_text_fill } from "../../../../z_vendor/getto-css/preact/design/form"

import { useAction } from "../../../common/hooks"

import { FormInput } from "../../../common/Form/FormInput"

import { LoginIDFormFieldComponent } from "../../../../auth/common/x_Component/Field/LoginID/component"
import { initialFormFieldComponentState } from "../../../../z_getto/getto-form/x_Resource/Form/component"

import { FormValidationResult } from "../../../../z_getto/getto-form/form/data"
import { LoginIDValidationError } from "../../../../auth/common/field/loginID/data"

type Props = Readonly<{
    loginID: LoginIDFormFieldComponent
    help: VNodeContent[]
}>
export function LoginIDFormField(resource: Props): VNode {
    const state = useAction(resource.loginID, initialFormFieldComponentState)

    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(FormInput, { type: "text", input: resource.loginID.input }),
            help: resource.help,
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
