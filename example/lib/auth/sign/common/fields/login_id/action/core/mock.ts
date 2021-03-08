import { initMockInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/action_input/mock"
import { initMockValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/action_validate_field/core/mock"

import { InputLoginIDAction } from "./action"

import { emptyBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockInputLoginIDAction(): InputLoginIDAction {
    return {
        board: initMockInputBoardValueResource("text", emptyBoardValue),
        validate: initMockValidateBoardFieldAction("loginID", { valid: false, err: [] }),
        clear: () => null,
        terminate: () => null,
    }
}
