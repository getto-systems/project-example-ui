import { ApplicationAbstractAction } from "../../../../getto-example/Application/impl"

import { clearBoard, setBoardValue } from "../../impl"

import { InputBoardInfra } from "../../infra"

import { InputBoardAction, InputBoardState, InputBoardMaterial } from "./action"

import { BoardValue } from "../../../kernel/data"

export type InputBoardBase<N extends string> = Readonly<{
    input: InputBoardInfra<N>
}>
export function initInputBoardAction<N extends string>(base: InputBoardBase<N>): InputBoardAction {
    return new Action({
        set: setBoardValue(base.input),
        clear: clearBoard(base.input),
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
