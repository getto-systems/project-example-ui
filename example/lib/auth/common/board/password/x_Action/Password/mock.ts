import { initMockInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/mock"
import { MockAction_simple } from "../../../../../../z_getto/application/mock"

import {
    CheckPasswordCharacterAction,
    PasswordBoardFieldAction,
    ValidatePasswordAction,
    ValidatePasswordState,
} from "./action"

import { BoardConvertResult, BoardValue } from "../../../../../../z_getto/board/kernel/data"
import { Password } from "../../../../password/data"
import { PasswordCharacterState } from "./data"

export function initMockPasswordBoardFieldAction(
    password: BoardValue,
    characterState: PasswordCharacterState
): PasswordBoardFieldAction {
    return {
        input: initMockInputBoardValueAction(password),
        validate: new Action(),
        clear: () => null,
        passwordCharacter: new CheckAction(characterState),
    }
}

class Action extends MockAction_simple<ValidatePasswordState> implements ValidatePasswordAction {
    readonly name = "password"

    get(): BoardConvertResult<Password> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}

class CheckAction implements CheckPasswordCharacterAction {
    state: PasswordCharacterState

    constructor(state: PasswordCharacterState) {
        this.state = state
    }

    check(): PasswordCharacterState {
        return this.state
    }
}
