import { initMockInputBoardValueAction } from "../../../../../../z_getto/board/input/x_Action/Input/mock"
import { MockAction_simple } from "../../../../../../z_getto/application/mock"

import {
    CheckPasswordCharacterAction,
    CheckPasswordCharacterState,
    PasswordBoardFieldAction,
    TogglePasswordDisplayBoardAction,
    TogglePasswordDisplayBoardState,
    ValidatePasswordAction,
    ValidatePasswordState,
} from "./action"

import { BoardConvertResult } from "../../../../../../z_getto/board/kernel/data"
import { Password } from "../../../../password/data"

export function initMockPasswordBoardFieldAction(): PasswordBoardFieldAction {
    return {
        input: initMockInputBoardValueAction(),
        validate: new Action(),
        clear: () => null,
        toggle: new ToggleAction(),
        passwordCharacter: new CheckAction(),
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

class ToggleAction
    extends MockAction_simple<TogglePasswordDisplayBoardState>
    implements TogglePasswordDisplayBoardAction {
    show() {
        // mock では特に何もしない
    }
    hide() {
        // mock では特に何もしない
    }
}

class CheckAction
    extends MockAction_simple<CheckPasswordCharacterState>
    implements CheckPasswordCharacterAction {}
