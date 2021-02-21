import { ApplicationAbstractAction } from "../../../../../../z_getto/application/impl"

import { initValidateBoardFieldAction } from "../../../../../../z_getto/board/validateField/x_Action/ValidateField/impl"
import { newInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/impl"

import { hidePasswordDisplayBoard, showPasswordDisplayBoard } from "../../toggleDisplay/impl"

import { ValidateBoardFieldInfra } from "../../../../../../z_getto/board/validateField/infra"

import {
    CheckPasswordCharacterAction,
    CheckPasswordCharacterMaterial,
    PasswordBoardFieldAction,
    TogglePasswordDisplayBoardAction,
    TogglePasswordDisplayBoardMaterial,
    TogglePasswordDisplayBoardState,
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

    const clear = () => input.clear()

    const toggle = new ToggleAction(() => input.get(), {
        show: showPasswordDisplayBoard,
        hide: hidePasswordDisplayBoard,
    })

    const passwordCharacter = new CheckAction({
        check: checkPasswordCharacter,
    })

    input.addInputHandler(() => {
        validate.check()
        passwordCharacter.check(input.get())
    })

    return { input, validate, clear, toggle, passwordCharacter }
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
    password: PasswordGetter
    material: TogglePasswordDisplayBoardMaterial

    constructor(password: PasswordGetter, material: TogglePasswordDisplayBoardMaterial) {
        super()
        this.password = password
        this.material = material
    }

    show(): void {
        this.material.show(this.password(), this.post)
    }
    hide(): void {
        this.material.hide(this.post)
    }
}
interface PasswordGetter {
    (): BoardValue
}

class CheckAction
    extends ApplicationAbstractAction<PasswordCharacterState>
    implements CheckPasswordCharacterAction {
    material: CheckPasswordCharacterMaterial

    constructor(material: CheckPasswordCharacterMaterial) {
        super()
        this.material = material
    }

    check(password: BoardValue): void {
        this.material.check(password, this.post)
    }
}
