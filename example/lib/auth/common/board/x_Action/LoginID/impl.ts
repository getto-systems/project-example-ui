import { initValidateBoardAction } from "../../../../../common/vendor/getto-board/validate/x_Action/Validate/impl"
import { initInputBoardAction } from "../../../../../common/vendor/getto-board/input/x_Action/Input/impl"

import { ValidateBoardInfra } from "../../../../../common/vendor/getto-board/validate/infra"
import { InputBoardInfra } from "../../../../../common/vendor/getto-board/input/infra"

import { LoginIDBoardResource } from "./action"

import { BoardValue } from "../../../../../common/vendor/getto-board/kernel/data"
import { ValidateLoginIDError } from "./data"
import { BoardInputType } from "../../../../../common/vendor/getto-board/input/data"

export type LoginIDBoardEmbed<N extends string> = Readonly<{
    name: N
    inputType: BoardInputType
}>

export function initLoginIDBoardResource<N extends string>(
    embed: LoginIDBoardEmbed<N>,
    infra: ValidateBoardInfra & InputBoardInfra
): LoginIDBoardResource {
    const input = initInputBoardAction({ name: "input", type: embed.inputType }, infra)

    const validate = initValidateBoardAction(
        { name: embed.name, validator: () => validateLoginID(input.get()) },
        infra
    )

    input.addInputHandler(() => validate.check())

    return { validate, input }
}

// login id には技術的な制限はないが、使用可能な最大長さは定義しておく
const MAX_LENGTH = 100 as const

function validateLoginID(value: BoardValue): ValidateLoginIDError[] {
    if (value.length === 0) {
        return EMPTY
    }
    if (value.length > MAX_LENGTH) {
        return TOO_LONG
    }
    return OK
}

const OK: ValidateLoginIDError[] = []
const EMPTY: ValidateLoginIDError[] = ["empty"]
const TOO_LONG: ValidateLoginIDError[] = ["too-long"]
