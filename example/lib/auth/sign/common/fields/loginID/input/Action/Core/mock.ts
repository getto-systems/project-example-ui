import { initMockInputBoardValueResource } from "../../../../../../../../z_vendor/getto-application/board/input/Action/mock"
import { initMockValidateBoardFieldAction } from "../../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/mock"

import { InputLoginIDAction } from "./action"

import { emptyBoardValue } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockInputLoginIDAction(): InputLoginIDAction {
    return {
        board: initMockInputBoardValueResource("text", emptyBoardValue),
        validate: initMockValidateBoardFieldAction("loginID", { valid: false, err: [] }),
        clear: () => null,
        terminate: () => null,
    }
}
