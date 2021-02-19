import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"

import { clearBoard, InputBoardEmbed, setBoardValue } from "../../impl"

import { InputBoardInfra } from "../../infra"

import { InputBoardAction, InputBoardState, InputBoardMaterial, BoardInputHandler } from "./action"

import { BoardValue } from "../../../kernel/data"
import { BoardInputType } from "../../data"

export function initInputBoardAction(
    embed: InputBoardEmbed,
    infra: InputBoardInfra
): InputBoardAction {
    return new Action(embed.type, () => infra.board.get(embed.name), {
        set: setBoardValue(embed, infra),
        clear: clearBoard(embed, infra),
    })
}

interface Pick {
    (): BoardValue
}
class Action extends ApplicationAbstractAction<InputBoardState> implements InputBoardAction {
    readonly type: BoardInputType

    inputHandlers: BoardInputHandler[] = []

    pick: Pick
    material: InputBoardMaterial

    constructor(type: BoardInputType, pick: Pick, material: InputBoardMaterial) {
        super()
        this.type = type
        this.pick = pick
        this.material = material

        this.terminateHook(() => {
            this.inputHandlers = []
        })
    }

    addInputHandler(handler: BoardInputHandler): void {
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
