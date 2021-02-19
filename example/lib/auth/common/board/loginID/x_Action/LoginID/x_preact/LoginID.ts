import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_text_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useAction } from "../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../common/vendor/getto-board/input/x_Action/Input/x_preact/Input"

import { initialValidateBoardState } from "../../../../../../../common/vendor/getto-board/validate/x_Action/Validate/action"
import { LoginIDBoardResource } from "../action"

import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "../data"
import { BoardValidateResult } from "../../../../../../../common/vendor/getto-board/validate/data"

type Props = LoginIDBoardResource &
    Readonly<{
        help: VNodeContent[]
    }>
export function LoginIDBoard(resource: Props): VNode {
    const state = useAction(resource.validate, initialValidateBoardState)

    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(InputBoard, resource),
            help: resource.help,
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({ ...content, notice: loginIDValidationError(state.result) })
        }
    }
}

function loginIDValidationError(result: BoardValidateResult<ValidateLoginIDError>): VNodeContent[] {
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
