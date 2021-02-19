import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"

import { clearBoardValue, InputBoardEmbed, setBoardValue } from "../../impl"

import { InputBoardValueInfra } from "../../infra"

import {
    InputBoardValueAction,
    InputBoardValueState,
    InputBoardValueMaterial,
    InputBoardValueHandler,
} from "./action"

import { BoardValue } from "../../../kernel/data"
import { InputBoardValueType } from "../../data"

export function initInputBoardValueAction(
    embed: InputBoardEmbed,
    infra: InputBoardValueInfra
): InputBoardValueAction {
    return new Action(embed.type, () => infra.board.get(embed.name), {
        set: setBoardValue(embed, infra),
        clear: clearBoardValue(embed, infra),
    })
}

interface Pick {
    (): BoardValue
}
class Action
    extends ApplicationAbstractAction<InputBoardValueState>
    implements InputBoardValueAction {
    readonly type: InputBoardValueType

    inputHandlers: InputBoardValueHandler[] = []

    pick: Pick
    material: InputBoardValueMaterial

    constructor(type: InputBoardValueType, pick: Pick, material: InputBoardValueMaterial) {
        super()
        this.type = type
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
        this.material.set(value, (event) => this.post(event))
        this.inputHandlers.forEach((handler) => handler())
    }
    clear(): void {
        this.material.clear((event) => this.post(event))
    }
}
