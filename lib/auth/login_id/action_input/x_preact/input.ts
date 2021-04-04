import { h, VNode } from "preact"

import { useApplicationAction } from "../../../../z_vendor/getto-application/action/x_preact/hooks"

import {
    field,
    field_error,
    label_text_fill,
} from "../../../../z_vendor/getto-css/preact/design/form"

import { VNodeContent } from "../../../../x_preact/design/common"

import { InputBoardComponent } from "../../../../z_vendor/getto-application/board/action_input/x_preact/input"

import { InputLoginIDResource, InputLoginIDResourceState } from "../resource"

import { ValidateBoardFieldState } from "../../../../z_vendor/getto-application/board/action_validate_field/core/action"

import { ValidateLoginIDError } from "../../data"

type Resource = InputLoginIDResource & Readonly<{ help: VNodeContent[] }>
export function InputLoginIDEntry(resource: Resource): VNode {
    return h(InputLoginIDComponent, {
        ...resource,
        state: useApplicationAction(resource.field.validate),
    })
}

type Props = Resource & InputLoginIDResourceState
export function InputLoginIDComponent(props: Props): VNode {
    return label_text_fill(content())

    function content() {
        const content = {
            title: "ログインID",
            body: h(InputBoardComponent, props.field.board),
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
        switch (err.type) {
            case "empty":
                return ["ログインIDを入力してください"]

            case "too-long":
                return [`ログインIDが長すぎます(${err.maxLength}文字以内)`]
        }
    })
}
