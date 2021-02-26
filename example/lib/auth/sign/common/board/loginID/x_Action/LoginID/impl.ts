import { initInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"
import { initValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/x_Action/ValidateField/impl"

import { ValidateBoardInfra } from "../../../../../../../z_vendor/getto-application/board/kernel/infra"

import { LoginIDBoardFieldAction } from "./action"

import {
    BoardConvertResult,
    BoardValue,
} from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { LoginID, markLoginID } from "../../../../loginID/data"
import { LOGIN_ID_MAX_LENGTH, ValidateLoginIDError } from "./data"

export type LoginIDBoardEmbed<N extends string> = Readonly<{
    name: N
}>

export function initLoginIDBoardFieldAction<N extends string>(
    embed: LoginIDBoardEmbed<N>,
    infra: ValidateBoardInfra,
): LoginIDBoardFieldAction {
    const resource = initInputBoardValueResource("text")

    const validate = initValidateBoardFieldAction(
        {
            name: embed.name,
            converter: () => convertLoginID(resource.input.get()),
            validator: () => validateLoginID(resource.input.get()),
        },
        infra,
    )

    resource.input.subscribeInputEvent(() => validate.check())

    return {
        resource,
        validate,
        clear: () => resource.input.clear(),
        terminate: () => {
            resource.input.terminate()
            validate.terminate()
        },
    }
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
