import { ApplicationAbstractAction } from "../../../../../../z_getto/application/impl"

import { initValidateBoardFieldAction } from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/impl"
import { newInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/impl"

import { hidePasswordDisplayBoard, showPasswordDisplayBoard } from "../../toggleDisplay/impl"

import { ValidateBoardFieldInfra } from "../../../../../../z_getto/board/validateField/infra"

import {
    PasswordBoardFieldAction,
    TogglePasswordDisplayBoardAction,
    TogglePasswordDisplayBoardMaterial,
    TogglePasswordDisplayBoardState,
} from "./action"

import { BoardConvertResult, BoardValue } from "../../../../../../z_getto/board/kernel/data"
import { markPassword, Password } from "../../../../password/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "./data"

export type PasswordBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initPasswordBoardFieldAction<N extends string>(
    embed: PasswordBoardEmbed<N>,
    infra: ValidateBoardFieldInfra
): PasswordBoardFieldAction {
    const input = newInputBoardValueAction()

    const validate = initValidateBoardFieldAction(
        {
            name: embed.name,
            validator: () => validatePassword(input.get()),
            converter: () => convertPassword(input.get()),
        },
        infra
    )

    input.addInputHandler(() => validate.check())

    return {
        input,
        validate,
        clear: () => input.clear(),
        toggle: new ToggleAction({
            show: showPasswordDisplayBoard,
            hide: hidePasswordDisplayBoard,
        }),
        characterState: () => checkPasswordCharacter(input.get()),
    }
}
export function terminatePasswordBoardFieldAction(resource: PasswordBoardFieldAction): void {
    resource.input.terminate()
    resource.validate.terminate()
}

function convertPassword(value: BoardValue): BoardConvertResult<Password> {
    return { success: true, value: markPassword(value) }
}

function validatePassword(value: BoardValue): ValidatePasswordError[] {
    if (value.length === 0) {
        return EMPTY
    }

    if (new TextEncoder().encode(value).byteLength > PASSWORD_MAX_BYTES) {
        return TOO_LONG
    }

    return OK
}

const OK: ValidatePasswordError[] = []
const EMPTY: ValidatePasswordError[] = ["empty"]
const TOO_LONG: ValidatePasswordError[] = ["too-long"]

class ToggleAction
    extends ApplicationAbstractAction<TogglePasswordDisplayBoardState>
    implements TogglePasswordDisplayBoardAction {
    material: TogglePasswordDisplayBoardMaterial

    constructor(material: TogglePasswordDisplayBoardMaterial) {
        super()
        this.material = material
    }

    show(): void {
        this.material.show(this.post)
    }
    hide(): void {
        this.material.hide(this.post)
    }
}

function checkPasswordCharacter(password: BoardValue): PasswordCharacterState {
    for (let i = 0; i < password.length; i++) {
        // 1文字でも 128バイト以上の文字があれば complex
        if (password.charCodeAt(i) >= 128) {
            return { multiByte: true }
        }
    }
    return { multiByte: false }
}
