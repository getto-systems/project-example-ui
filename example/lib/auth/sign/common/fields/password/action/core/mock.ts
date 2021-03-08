import { initMockInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/action_input/mock"
import { initMockValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/action_validate_field/core/mock"

import { InputPasswordAction } from "./action"

import { BoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { PasswordCharacterState } from "../../data"

export function initMockInputPasswordAction(
    password: BoardValue,
    characterState: PasswordCharacterState,
): InputPasswordAction {
    return {
        board: initMockInputBoardValueResource("password", password),
        validate: initMockValidateBoardFieldAction("password", { valid: false, err: [] }),
        clear: () => null,
        checkCharacter: () => characterState,
        terminate: () => null,
    }
}
