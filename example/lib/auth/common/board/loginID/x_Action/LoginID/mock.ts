import { initMockInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/mock"
import { MockStateAction_simple } from "../../../../../../z_getto/application/mock"

import { LoginIDBoardFieldAction, ValidateLoginIDAction, ValidateLoginIDState } from "./action"

import { LoginID } from "../../../../loginID/data"
import { BoardConvertResult, emptyBoardValue } from "../../../../../../z_getto/board/kernel/data"

export function initMockLoginIDBoardFieldAction(): LoginIDBoardFieldAction {
    return {
        validate: new Action(),
        input: initMockInputBoardValueAction(emptyBoardValue),
        clear: () => null,
        terminate: () => null,
    }
}

class Action extends MockStateAction_simple<ValidateLoginIDState> implements ValidateLoginIDAction {
    readonly name = "loginID"

    get(): BoardConvertResult<LoginID> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
