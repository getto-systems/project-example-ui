import { LoginIDBoardFieldAction, ValidateLoginIDAction, ValidateLoginIDState } from "./action"

import { LoginID } from "../../../../loginID/data"
import {
    BoardConvertResult,
    emptyBoardValue,
} from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { ApplicationMockStateAction } from "../../../../../../../z_vendor/getto-application/action/impl"
import { initMockInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/impl"

export function initMockLoginIDBoardFieldAction(): LoginIDBoardFieldAction {
    return {
        validate: new Action(),
        resource: initMockInputBoardValueResource("text", emptyBoardValue),
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
