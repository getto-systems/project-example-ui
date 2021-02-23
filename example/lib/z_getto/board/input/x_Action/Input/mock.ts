import { InputBoardValueAction } from "./action"

import { BoardValue } from "../../../kernel/data"

export function initMockInputBoardValueAction(value: BoardValue): InputBoardValueAction {
    return new Action(value)
}

class Action implements InputBoardValueAction {
    value: BoardValue

    constructor(value: BoardValue) {
        this.value = value
    }

    linkStore() {
        // mock では特に何もしない
    }

    addInputHandler() {
        // mock では特に何もしない
    }
    triggerInputEvent() {
        // mock では特に何もしない
    }

    get(): BoardValue {
        return this.value
    }
    set() {
        // mock では特に何もしない
    }
    clear() {
        // mock では特に何もしない
    }

    terminate() {
        // mock では特に何もしない
    }
}
