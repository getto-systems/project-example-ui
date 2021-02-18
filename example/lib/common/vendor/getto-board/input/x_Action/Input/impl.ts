import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"

import { clearBoard, InputBoardEmbed, setBoardValue } from "../../impl"

import { InputBoardInfra } from "../../infra"

import { InputBoardAction, InputBoardState, InputBoardMaterial } from "./action"

import { BoardValue } from "../../../kernel/data"

export function initInputBoardAction<N extends string>(
    embed: InputBoardEmbed<N>,
    infra: InputBoardInfra
): InputBoardAction {
    return new Action({
        set: setBoardValue(embed, infra),
        clear: clearBoard(embed, infra),
    })
}

class Action extends ApplicationAbstractAction<InputBoardState> implements InputBoardAction {
    material: InputBoardMaterial

    constructor(material: InputBoardMaterial) {
        super()
        this.material = material
    }

    set(value: BoardValue): void {
        this.material.set(value, (event) => this.post(event))
    }
    clear(): void {
        this.material.clear((event) => this.post(event))
    }
}
