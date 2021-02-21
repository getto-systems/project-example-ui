import { initMockInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/mock"
import { MockAction_simple } from "../../../../../../z_getto/application/mock"

import { initialInputBoardState } from "../../../../../../z_getto/board/input/x_Action/Input/action"
import { LoginIDBoardFieldAction, ValidateLoginIDAction, ValidateLoginIDState } from "./action"

import { LoginID } from "../../../../loginID/data"
import { BoardConvertResult } from "../../../../../../z_getto/board/kernel/data"

export function initMockLoginIDBoardFieldAction(): LoginIDBoardFieldAction {
    return {
        validate: new Action(),
        input: initMockInputBoardValueAction(initialInputBoardState),
        clear: () => null,
    }
}

class Action extends MockAction_simple<ValidateLoginIDState> implements ValidateLoginIDAction {
    readonly name = "loginID"

    get(): BoardConvertResult<LoginID> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
