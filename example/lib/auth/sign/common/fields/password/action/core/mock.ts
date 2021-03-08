import { initMockInputBoardValueResource } from "../../../../../../../z_vendor/getto-application/board/input/Action/mock"
import { initMockValidateBoardFieldAction } from "../../../../../../../z_vendor/getto-application/board/validateField/Action/Core/mock"

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
