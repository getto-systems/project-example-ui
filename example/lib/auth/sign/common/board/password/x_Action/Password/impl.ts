import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/x_Action/ValidateField/impl"

import { checkPasswordCharacter } from "../../checkCharacter/impl"

import { ValidateBoardInfra } from "../../../../../../../z_vendor/getto-application/board/kernel/infra"

import {
    CheckPasswordCharacterAction,
    CheckPasswordCharacterMaterial,
    PasswordBoardFieldAction,
} from "./action"

import {
    BoardConvertResult,
    BoardValue,
} from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { markPassword, Password } from "../../../../password/data"
import { PasswordCharacterState, PASSWORD_MAX_BYTES, ValidatePasswordError } from "./data"

export type PasswordBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initPasswordBoardFieldAction<N extends string>(
    embed: PasswordBoardEmbed<N>,
    infra: ValidateBoardInfra,
): PasswordBoardFieldAction {
    const resource = initInputBoardValueResource("password")

    const validate = initValidateBoardFieldAction(
        {
            name: embed.name,
            validator: () => validatePassword(resource.input.get()),
            converter: () => convertPassword(resource.input.get()),
        },
        infra,
    )

    const clear = () => resource.input.clear()

    const passwordCharacter = new CheckAction(() => resource.input.get(), {
        check: checkPasswordCharacter,
    })

    resource.input.subscribeInputEvent(() => {
        validate.check()
    })

    return {
        resource,
        validate,
        clear,
        passwordCharacter,
        terminate: () => {
            resource.input.terminate()
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
