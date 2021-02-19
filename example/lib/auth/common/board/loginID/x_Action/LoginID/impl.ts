import { initValidateBoardFieldAction } from "../../../../../../common/vendor/getto-board/validateField/x_Action/ValidateField/impl"
import { initInputBoardValueAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/impl"

import { ValidateBoardFieldInfra } from "../../../../../../common/vendor/getto-board/validateField/infra"

import { LoginIDBoardFieldAction } from "./action"

import {
    BoardConvertResult,
    BoardValue,
} from "../../../../../../common/vendor/getto-board/kernel/data"
import { LoginID, markLoginID } from "../../../../loginID/data"
import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "./data"

export type LoginIDBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initLoginIDBoardFieldAction<N extends string>(
    embed: LoginIDBoardEmbed<N>,
    infra: ValidateBoardFieldInfra
): LoginIDBoardFieldAction {
    const input = initInputBoardValueAction()

    const validate = initValidateBoardFieldAction(
        {
            name: embed.name,
            converter: () => convertLoginID(input.get()),
            validator: () => validateLoginID(input.get()),
        },
        infra
    )

    input.addInputHandler(() => validate.check())

    return { input, validate, clear: () => input.clear() }
}
export function terminateLoginIDBoardFieldAction(resource: LoginIDBoardFieldAction): void {
    resource.input.terminate()
    resource.validate.terminate()
}

function convertLoginID(value: BoardValue): BoardConvertResult<LoginID> {
    return { success: true, value: markLoginID(value) }
}
function validateLoginID(value: BoardValue): ValidateLoginIDError[] {
    if (value.length === 0) {
        return EMPTY
    }
    if (value.length > LOGIN_ID_MAX_LENGTH) {
        return TOO_LONG
    }
    return OK
}

const OK: ValidateLoginIDError[] = []
const EMPTY: ValidateLoginIDError[] = ["empty"]
const TOO_LONG: ValidateLoginIDError[] = ["too-long"]
