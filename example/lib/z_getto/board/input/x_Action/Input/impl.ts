import { ApplicationAbstractAction } from "../../../../application/impl"

import { newBoardValueStore } from "../../infra/store"

import { clearBoardValue, setBoardValue } from "../../impl"

import { InputBoardValueInfra } from "../../infra"

import {
    InputBoardValueAction,
    InputBoardValueState,
    InputBoardValueMaterial,
    InputBoardValueHandler,
} from "./action"

import { BoardValue } from "../../../kernel/data"

export function newInputBoardValueAction(): InputBoardValueAction {
    const infra: InputBoardValueInfra = { store: newBoardValueStore() }
    return new Action(() => infra.store.get(), {
        set: setBoardValue(infra),
        clear: clearBoardValue(infra),
    })
}

interface Pick {
    (): BoardValue
}
class Action
    extends ApplicationAbstractAction<InputBoardValueState>
    implements InputBoardValueAction {
    inputHandlers: InputBoardValueHandler[] = []

    pick: Pick
    material: InputBoardValueMaterial

    constructor(pick: Pick, material: InputBoardValueMaterial) {
        super()
        this.pick = pick
        this.material = material

        this.terminateHook(() => {
            this.inputHandlers = []
        })
    }

    addInputHandler(handler: InputBoardValueHandler): void {
        this.inputHandlers = [...this.inputHandlers, handler]
    }

    get(): BoardValue {
        return this.pick()
    }
    set(value: BoardValue): void {
        this.material.set(value, this.post)
        this.inputHandlers.forEach((handler) => handler())
    }
    clear(): void {
        this.material.clear(this.post)
    }
}
