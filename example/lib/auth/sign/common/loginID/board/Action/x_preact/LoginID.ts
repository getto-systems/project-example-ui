import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_text_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../z_vendor/getto-application/board/input/Action/x_preact/Input"

import { ValidateBoardFieldState } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/action"
import { InputLoginIDResource, InputLoginIDResourceState } from "../action"

import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "../../../convert"

type Resource = InputLoginIDResource & Readonly<{ help: VNodeContent[] }>
export function InputLoginID(resource: Resource): VNode {
    return h(View, <InputLoginIDProps>{
        ...resource,
        state: useApplicationAction(resource.field.validate),
    })
}

export type InputLoginIDProps = Resource & InputLoginIDResourceState
export function View(props: InputLoginIDProps): VNode {
    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(InputBoard, props.field.board),
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
    result: ValidateBoardFieldState<ValidateLoginIDError>,
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
