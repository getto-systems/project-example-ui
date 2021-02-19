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

import { initialValidateBoardState } from "../../../../../../../common/vendor/getto-board/validate/x_Action/Validate/action"
import { initialTogglePasswordDisplayBoardState, PasswordBoardResource } from "../action"

import { BoardValue } from "../../../../../../../common/vendor/getto-board/kernel/data"
import { BoardValidateResult } from "../../../../../../../common/vendor/getto-board/validate/data"
import { PasswordCharacterState, ValidatePasswordError } from "../data"

type Props = PasswordBoardResource &
    Readonly<{
        help: VNodeContent[]
    }>
export function PasswordBoard(resource: Props): VNode {
    const state = useAction(resource.validate, initialValidateBoardState)
    const toggleState = useAction(resource.toggle, initialTogglePasswordDisplayBoardState)

    return label_password_fill(content())

    function content() {
        const content = {
            title: "パスワード",
            body: h(InputBoard, resource),
            help: [...resource.help, ...passwordDisplay()],
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(state.result, resource.characterState()),
            })
        }
    }

    function passwordDisplay(): VNodeContent[] {
        if (toggleState.visible) {
            return [
                html`<a href="#" onClick=${onHide}>
                    <i class="lnir lnir-key-alt"></i> パスワードを隠す ${characterHelp()}
                </a>`,
                showPassword(resource.input.get()),
            ]
        } else {
            return [
                html`<a href="#" onClick=${onShow}>
                    <i class="lnir lnir-key-alt"></i> パスワードを表示 ${characterHelp()}
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
            if (resource.characterState().multiByte) {
                return "(マルチバイト文字が含まれています)"
            } else {
                return ""
            }
        }

        function onShow(e: MouseEvent) {
            linkClicked(e)
            resource.toggle.show()
        }
        function onHide(e: MouseEvent) {
            linkClicked(e)
            resource.toggle.hide()
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
    result: BoardValidateResult<ValidatePasswordError>,
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
                    return ["パスワードが長すぎます(18文字程度)"]
                } else {
                    return ["パスワードが長すぎます(72文字以内)"]
                }
        }
    })
}
