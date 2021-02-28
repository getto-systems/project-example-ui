import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_password_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../z_vendor/getto-application/board/input/Action/x_preact/Input"

import { ValidateBoardFieldState } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/action"
import { InputPasswordResource, InputPasswordResourceState } from "../action"

import { PasswordCharacterState } from "../data"
import { PASSWORD_MAX_BYTES, ValidatePasswordError } from "../../../../password/data"

type Resource = InputPasswordResource & Readonly<{ help: VNodeContent[] }>
export function InputPassword(resource: Resource): VNode {
    return h(View, <InputPasswordProps>{
        ...resource,
        state: useApplicationAction(resource.field.validate),
    })
}

export type InputPasswordProps = Resource & InputPasswordResourceState
export function View(props: InputPasswordProps): VNode {
    return label_password_fill(content())

    function content() {
        const content = {
            title: "パスワード",
            body: h(InputBoard, props.field.resource),
            help: [...props.help, characterHelp()],
        }

        if (props.state.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(props.state, props.field.checkCharacter()),
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
    character: PasswordCharacterState,
): VNodeContent[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return ["パスワードを入力してください"]

            case "too-long":
                if (character.multiByte) {
                    // マルチバイト文字は最大で 4 bytes なので max bytes / 4 をヒントとして表示する
                    return [`パスワードが長すぎます(${Math.floor(PASSWORD_MAX_BYTES / 4)}文字程度)`]
                } else {
                    return [`パスワードが長すぎます(${PASSWORD_MAX_BYTES}文字以内)`]
                }
        }
    })
}