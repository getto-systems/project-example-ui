import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_text_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../z_getto/board/input/x_Action/Input/x_preact/Input"

import { initialValidateBoardFieldState } from "../../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"
import { LoginIDBoardFieldResource } from "../action"

import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "../data"
import { BoardFieldValidateResult } from "../../../../../../../z_getto/board/validateField/data"

type Props = LoginIDBoardFieldResource &
    Readonly<{
        help: VNodeContent[]
    }>
export function LoginIDBoard(resource: Props): VNode {
    const state = useApplicationAction(resource.field.validate, initialValidateBoardFieldState)

    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(InputBoard, { type: "text", ...resource.field }),
            help: resource.help,
        }

        if (state.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDValidationError(state) })
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
