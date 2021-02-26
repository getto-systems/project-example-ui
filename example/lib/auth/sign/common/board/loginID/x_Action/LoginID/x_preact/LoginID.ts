import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_text_fill,
} from "../../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../../z_vendor/getto-application/board/input/x_Action/Input/x_preact/Input"

import { LoginIDBoardFieldResource, ValidateLoginIDState } from "../action"

import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "../data"
import { BoardFieldValidateResult } from "../../../../../../../../z_vendor/getto-application/board/validateField/data"

type Resource = LoginIDBoardFieldResource & Readonly<{ help: VNodeContent[] }>
export function LoginIDBoard(resource: Resource): VNode {
    return h(View, <LoginIDBoardFieldProps>{
        ...resource,
        state: useApplicationAction(resource.field.validate),
    })
}

export type LoginIDBoardFieldProps = Resource & Readonly<{ state: ValidateLoginIDState }>
export function View(props: LoginIDBoardFieldProps): VNode {
    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(InputBoard, { type: "text", ...props.field }),
            help: props.help,
        }

        if (props.state.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDValidationError(props.state) })
        }
    }
}

function loginIDValidationError(
    result: BoardFieldValidateResult<ValidateLoginIDError>
): VNodeContent[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return ["ログインIDを入力してください"]

            case "too-long":
                return [`ログインIDが長すぎます(${LOGIN_ID_MAX_LENGTH}文字以内)`]
        }
    })
}
