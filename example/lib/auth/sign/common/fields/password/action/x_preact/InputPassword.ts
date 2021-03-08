import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_password_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../z_vendor/getto-application/board/action_input/x_preact/Input"

import { ValidateBoardFieldState } from "../../../../../../../z_vendor/getto-application/board/action_validate_field/core/action"
import { InputPasswordResource, InputPasswordResourceState } from "../resource"

import { ValidatePasswordError } from "../../data"

type Resource = InputPasswordResource & Readonly<{ help: VNodeContent[] }>
export function InputPassword(resource: Resource): VNode {
    return h(InputPasswordComponent, {
        ...resource,
        state: useApplicationAction(resource.field.validate),
    })
}

export type InputPasswordProps = Resource & InputPasswordResourceState
export function InputPasswordComponent(props: InputPasswordProps): VNode {
    return label_password_fill(content())

    function content() {
        const content = {
            title: "パスワード",
            body: h(InputBoard, props.field.board),
            help: [...props.help, characterHelp()],
        }

        if (props.state.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(props.state),
            })
        }
    }

    function characterHelp(): string {
        if (props.field.checkCharacter().multiByte) {
            return "(マルチバイト文字が含まれています)"
        } else {
            return ""
        }
    }
}

function passwordValidationError(
    result: ValidateBoardFieldState<ValidatePasswordError>,
): VNodeContent[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err.type) {
            case "empty":
                return ["パスワードを入力してください"]

            case "too-long":
                if (err.multiByte) {
                    // マルチバイト文字は最大で 4 bytes なので max bytes / 4 をヒントとして表示する
                    return [`パスワードが長すぎます(${Math.floor(err.maxBytes / 4)}文字程度)`]
                } else {
                    return [`パスワードが長すぎます(${err.maxBytes}文字以内)`]
                }
        }
    })
}
