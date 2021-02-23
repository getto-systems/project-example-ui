import { initValidateBoardFieldAction } from "../../../../../../../z_getto/board/validateField/x_Action/ValidateField/impl"
import { newInputBoardValueAction } from "../../../../../../../z_getto/board/input/x_Action/Input/impl"

import { checkPasswordCharacter } from "../../checkCharacter/impl"

import { ValidateBoardInfra } from "../../../../../../../z_getto/board/kernel/infra"

import {
    CheckPasswordCharacterAction,
    CheckPasswordCharacterMaterial,
    PasswordBoardFieldAction,
} from "./action"

import { BoardConvertResult, BoardValue } from "../../../../../../../z_getto/board/kernel/data"
import { markPassword, Password } from "../../../../password/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "./data"

export type PasswordBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initPasswordBoardFieldAction<N extends string>(
    embed: PasswordBoardEmbed<N>,
    infra: ValidateBoardInfra,
): PasswordBoardFieldAction {
    const input = newInputBoardValueAction()

    const validate = initValidateBoardFieldAction(
        {
            name: embed.name,
            validator: () => validatePassword(input.get()),
            converter: () => convertPassword(input.get()),
        },
        infra,
    )

    const clear = () => input.clear()

    const passwordCharacter = new CheckAction(() => input.get(), {
        check: checkPasswordCharacter,
    })

    input.subscribeInputEvent(() => {
        validate.check()
    })

    return {
        input,
        validate,
        clear,
        passwordCharacter,
        terminate: () => {
            input.terminate()
            validate.terminate()
        },
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

class CheckAction implements CheckPasswordCharacterAction {
    password: PasswordGetter
    material: CheckPasswordCharacterMaterial

    constructor(password: PasswordGetter, material: CheckPasswordCharacterMaterial) {
        this.password = password
        this.material = material
    }

    check(): PasswordCharacterState {
        return this.material.check(this.password())
    }
}
interface PasswordGetter {
    (): BoardValue
}
