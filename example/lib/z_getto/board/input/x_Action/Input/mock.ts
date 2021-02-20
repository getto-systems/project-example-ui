import { MockAction_simple } from "../../../../application/mock"

import { InputBoardValueAction, InputBoardValueState } from "./action"

import { BoardValue, emptyBoardValue } from "../../../kernel/data"

export function initMockInputBoardValueAction(): InputBoardValueAction {
    return new Action()
}

class Action extends MockAction_simple<InputBoardValueState> implements InputBoardValueAction {
    addInputHandler() {
        // mock では特に何もしない
    }

    get(): BoardValue {
        return emptyBoardValue
    }
    set() {
        // mock では特に何もしない
    }
    clear() {
        // mock では特に何もしない
    }
}
