import { h, VNode } from "preact"

import { VNodeContent } from "../../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_password_fill,
} from "../../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../../z_vendor/getto-application/board/input/Action/x_preact/Input"

import { PasswordBoardFieldResource, ValidatePasswordState } from "../action"

import { BoardFieldValidateResult } from "../../../../../../../../z_vendor/getto-application/board/validateField/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "../data"

type Resource = PasswordBoardFieldResource & Readonly<{ help: VNodeContent[] }>
export function PasswordBoard(resource: Resource): VNode {
    return h(View, <PasswordBoardFieldProps>{
        ...resource,
        state: useApplicationAction(resource.field.validate),
    })
}

export type PasswordBoardFieldProps = Resource & Readonly<{ state: ValidatePasswordState }>
export function View(props: PasswordBoardFieldProps): VNode {
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
                notice: passwordValidationError(props.state, props.field.passwordCharacter.check()),
            })
        }
    }

    function characterHelp(): string {
        if (props.field.passwordCharacter.check().multiByte) {
            return "(マルチバイト文字が含まれています)"
        } else {
            return ""
        }
    }
}

function passwordValidationError(
    result: BoardFieldValidateResult<ValidatePasswordError>,
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
