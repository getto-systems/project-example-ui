import { initMockInputBoardValueAction } from "../../../../../../../z_getto/board/input/x_Action/Input/mock"

import {
    CheckPasswordCharacterAction,
    PasswordBoardFieldAction,
    ValidatePasswordAction,
    ValidatePasswordState,
} from "./action"

import { BoardConvertResult, BoardValue } from "../../../../../../../z_getto/board/kernel/data"
import { Password } from "../../../../password/data"
import { PasswordCharacterState } from "./data"
import { ApplicationMockStateAction } from "../../../../../../../z_getto/action/impl"

export function initMockPasswordBoardFieldAction(
    password: BoardValue,
    characterState: PasswordCharacterState,
): PasswordBoardFieldAction {
    return {
        input: initMockInputBoardValueAction(password),
        validate: new Action(),
        clear: () => null,
        passwordCharacter: new CheckAction(characterState),
        terminate: () => null,
    }
}

class Action
    extends ApplicationMockStateAction<ValidatePasswordState>
    implements ValidatePasswordAction {
    readonly initialState: ValidatePasswordState = { valid: true }
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
