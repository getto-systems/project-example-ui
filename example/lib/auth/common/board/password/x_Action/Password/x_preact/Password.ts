import { h, VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_password_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useApplicationAction } from "../../../../../../../x_preact/common/hooks"
import { icon } from "../../../../../../../x_preact/common/icon"

import { InputBoard } from "../../../../../../../z_getto/board/input/x_Action/Input/x_preact/Input"

import { initialValidateBoardFieldState } from "../../../../../../../z_getto/board/validateField/x_Action/ValidateField/action"
import {
    initialTogglePasswordDisplayBoardState,
    PasswordBoardFieldResource,
    TogglePasswordDisplayBoardState,
    ValidatePasswordState,
} from "../action"

import { BoardValue } from "../../../../../../../z_getto/board/kernel/data"
import { BoardFieldValidateResult } from "../../../../../../../z_getto/board/validateField/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "../data"

type Resource = PasswordBoardFieldResource & Readonly<{ help: VNodeContent[] }>
export function PasswordBoard(resource: Resource): VNode {
    return h(View, {
        ...resource,
        state: {
            validate: useApplicationAction(resource.field.validate, initialValidateBoardFieldState),
            toggle: useApplicationAction(
                resource.field.toggle,
                initialTogglePasswordDisplayBoardState
            ),
        },
    })
}

export type PasswordBoardFieldProps = Resource &
    Readonly<{
        state: Readonly<{
            validate: ValidatePasswordState
            toggle: TogglePasswordDisplayBoardState
        }>
    }>
export function View(props: PasswordBoardFieldProps): VNode {
    return label_password_fill(content())

    function content() {
        const content = {
            title: "パスワード",
            body: h(InputBoard, { type: "password", ...props.field }),
            help: [...props.help, ...passwordDisplay()],
        }

        if (props.state.validate.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(
                    props.state.validate,
                    props.field.passwordCharacter.check()
                ),
            })
        }
    }

    function passwordDisplay(): VNodeContent[] {
        if (props.state.toggle.visible) {
            return [
                html`<a href="#" onClick=${onHide}>
                    ${icon("key-alt")} パスワードを隠す ${characterHelp()}
                </a>`,
                showPassword(props.field.input.get()),
            ]
        } else {
            return [
                html`<a href="#" onClick=${onShow}>
                    ${icon("key-alt")} パスワードを表示 ${characterHelp()}
                </a>`,
            ]
        }

        function showPassword(password: BoardValue): string {
            if (password.length === 0) {
                return "(入力されていません)"
            }
            return password
        }

        function characterHelp(): string {
            if (props.field.passwordCharacter.check().multiByte) {
                return "(マルチバイト文字が含まれています)"
            } else {
                return ""
            }
        }

        function onShow(e: MouseEvent) {
            linkClicked(e)
            props.field.toggle.show()
        }
        function onHide(e: MouseEvent) {
            linkClicked(e)
            props.field.toggle.hide()
        }
        function linkClicked(e: MouseEvent) {
            e.preventDefault()

            // クリック後 focus 状態になるのでキャンセル
            if (e.target instanceof HTMLElement) {
                e.target.blur()
            }
        }
    }
}

function passwordValidationError(
    result: BoardFieldValidateResult<ValidatePasswordError>,
    character: PasswordCharacterState
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
