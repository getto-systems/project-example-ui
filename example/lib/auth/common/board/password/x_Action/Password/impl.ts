import { ApplicationAbstractAction } from "../../../../../../common/vendor/getto-example/Application/impl"

import { initValidateBoardAction } from "../../../../../../common/vendor/getto-board/validate/x_Action/Validate/impl"
import { initInputBoardAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/impl"

import { hidePasswordDisplayBoard, showPasswordDisplayBoard } from "../../toggleDisplay/impl"

import { ValidateBoardInfra } from "../../../../../../common/vendor/getto-board/validate/infra"
import { InputBoardInfra } from "../../../../../../common/vendor/getto-board/input/infra"

import {
    PasswordBoardResource,
    TogglePasswordDisplayBoardAction,
    TogglePasswordDisplayBoardMaterial,
    TogglePasswordDisplayBoardState,
} from "./action"

import { BoardValue } from "../../../../../../common/vendor/getto-board/kernel/data"
import { markPassword, Password } from "../../../../password/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "./data"
import { BoardConvertResult } from "../../../../../../common/vendor/getto-board/validate/data"

export type PasswordBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initPasswordBoardResource<N extends string>(
    embed: PasswordBoardEmbed<N>,
    infra: ValidateBoardInfra & InputBoardInfra
): PasswordBoardResource {
    const input = initInputBoardAction({ name: "input", type: "password" }, infra)

    const validate = initValidateBoardAction(
        {
            name: embed.name,
            validator: () => validatePassword(input.get()),
            converter: () => convertPassword(input.get()),
        },
        infra
    )

    input.addInputHandler(() => validate.check())

    return {
        validate,
        input,
        toggle: new ToggleAction({
            show: showPasswordDisplayBoard,
            hide: hidePasswordDisplayBoard,
        }),
        characterState: () => checkPasswordCharacter(input.get()),
    }
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
        this.material.show((event) => this.post(event))
    }
    hide(): void {
        this.material.hide((event) => this.post(event))
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
