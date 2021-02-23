import { ApplicationAbstractStateAction } from "../../../../../../z_getto/application/impl"

import { initValidateBoardFieldAction } from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/impl"
import { newInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/impl"

import { ValidateBoardFieldInfra } from "../../../../../../z_getto/board/validateField/infra"

import {
    CheckPasswordCharacterAction,
    CheckPasswordCharacterMaterial,
    PasswordBoardFieldAction,
} from "./action"

import { BoardConvertResult, BoardValue } from "../../../../../../z_getto/board/kernel/data"
import { markPassword, Password } from "../../../../password/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "./data"
import { checkPasswordCharacter } from "../../checkCharacter/impl"

export type PasswordBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initPasswordBoardFieldAction<N extends string>(
    embed: PasswordBoardEmbed<N>,
    infra: ValidateBoardFieldInfra,
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

    input.addInputHandler(() => {
        validate.check()
    })

    return { input, validate, clear, passwordCharacter }
}
export function terminatePasswordBoardFieldAction(resource: PasswordBoardFieldAction): void {
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

class CheckAction
    extends ApplicationAbstractStateAction<PasswordCharacterState>
    implements CheckPasswordCharacterAction {
    password: PasswordGetter
    material: CheckPasswordCharacterMaterial

    constructor(password: PasswordGetter, material: CheckPasswordCharacterMaterial) {
        super()
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
