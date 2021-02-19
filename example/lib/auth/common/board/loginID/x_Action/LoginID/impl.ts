import { initValidateBoardAction } from "../../../../../../common/vendor/getto-board/validate/x_Action/Validate/impl"
import { initInputBoardAction } from "../../../../../../common/vendor/getto-board/input/x_Action/Input/impl"

import { ValidateBoardInfra } from "../../../../../../common/vendor/getto-board/validate/infra"
import { InputBoardInfra } from "../../../../../../common/vendor/getto-board/input/infra"

import { LoginIDBoardResource } from "./action"

import { BoardValue } from "../../../../../../common/vendor/getto-board/kernel/data"
import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "./data"

export type LoginIDBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initLoginIDBoardResource<N extends string>(
    embed: LoginIDBoardEmbed<N>,
    infra: ValidateBoardInfra & InputBoardInfra
): LoginIDBoardResource {
    const input = initInputBoardAction({ name: "input", type: "text" }, infra)

    const validate = initValidateBoardAction(
        { name: embed.name, validator: () => validateLoginID(input.get()) },
        infra
    )

    input.addInputHandler(() => validate.check())

    return { validate, input }
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
