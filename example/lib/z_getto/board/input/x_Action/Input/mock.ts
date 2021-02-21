import { MockAction_state } from "../../../../application/mock"

import { InputBoardValueAction, InputBoardValueState } from "./action"

import { BoardValue } from "../../../kernel/data"

export function initMockInputBoardValueAction(state: InputBoardValueState): InputBoardValueAction {
    return new Action(state)
}

class Action extends MockAction_state<InputBoardValueState> implements InputBoardValueAction {
    addInputHandler() {
        // mock では特に何もしない
    }

    get(): BoardValue {
        return this.state
    }
    set() {
        // mock では特に何もしない
    }
    clear() {
        // mock では特に何もしない
    }
}
