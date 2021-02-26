import { initMockInputBoardValueAction } from "../../../../../../../z_vendor/getto-application/board/input/x_Action/Input/mock"

import { LoginIDBoardFieldAction, ValidateLoginIDAction, ValidateLoginIDState } from "./action"

import { LoginID } from "../../../../loginID/data"
import { BoardConvertResult, emptyBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"

export function initMockLoginIDBoardFieldAction(): LoginIDBoardFieldAction {
    return {
        validate: new Action(),
        input: initMockInputBoardValueAction(emptyBoardValue),
        clear: () => null,
        terminate: () => null,
    }
}

class Action
    extends ApplicationMockStateAction<ValidateLoginIDState>
    implements ValidateLoginIDAction {
    readonly initialState: ValidateLoginIDState = { valid: true }
    readonly name = "loginID"

    get(): BoardConvertResult<LoginID> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
