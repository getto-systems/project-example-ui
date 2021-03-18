import { mockInputBoardValueResource } from "../../../../z_vendor/getto-application/board/action_input/mock"
import { mockValidateBoardFieldAction } from "../../../../z_vendor/getto-application/board/action_validate_field/core/mock"

import { InputLoginIDAction } from "./action"

import { emptyBoardValue } from "../../../../z_vendor/getto-application/board/kernel/data"

export function mockInputLoginIDAction(): InputLoginIDAction {
    return {
        board: mockInputBoardValueResource("text", emptyBoardValue),
        validate: mockValidateBoardFieldAction("loginID", { valid: false, err: [] }),
        clear: () => null,
        terminate: () => null,
    }
}
