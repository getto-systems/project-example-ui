import { h, VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_password_fill,
} from "../../../../../../../z_vendor/getto-css/preact/design/form"

import { useAction } from "../../../../../../../x_preact/common/hooks"

import { InputBoard } from "../../../../../../../common/vendor/getto-board/input/x_Action/Input/x_preact/Input"

import { initialValidateBoardFieldState } from "../../../../../../../common/vendor/getto-board/validateField/x_Action/ValidateField/action"
import { initialTogglePasswordDisplayBoardState, PasswordBoardFieldResource } from "../action"

import { BoardValue } from "../../../../../../../common/vendor/getto-board/kernel/data"
import { BoardFieldValidateResult } from "../../../../../../../common/vendor/getto-board/validateField/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "../data"
import { icon } from "../../../../../../../x_preact/common/icon"

type Props = PasswordBoardFieldResource &
    Readonly<{
        help: VNodeContent[]
    }>
export function PasswordBoard(resource: Props): VNode {
    const state = useAction(resource.field.validate, initialValidateBoardFieldState)
    const toggleState = useAction(resource.field.toggle, initialTogglePasswordDisplayBoardState)

    return label_password_fill(content())

    function content() {
        const content = {
            title: "パスワード",
            body: h(InputBoard, { type: "password", ...resource.field }),
            help: [...resource.help, ...passwordDisplay()],
        }

        if (state.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(state, resource.field.characterState()),
            })
        }
    }

    function passwordDisplay(): VNodeContent[] {
        if (toggleState.visible) {
            return [
                html`<a href="#" onClick=${onHide}>
                    ${icon("key-alt")} パスワードを隠す ${characterHelp()}
                </a>`,
                showPassword(resource.field.input.get()),
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
            if (resource.field.characterState().multiByte) {
                return "(マルチバイト文字が含まれています)"
            } else {
                return ""
            }
        }

        function onShow(e: MouseEvent) {
            linkClicked(e)
            resource.field.toggle.show()
        }
        function onHide(e: MouseEvent) {
            linkClicked(e)
            resource.field.toggle.hide()
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
