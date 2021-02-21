import { BoardValueStore } from "../../infra"

import { BoardValue } from "../../../kernel/data"
import { InputBoardValueType } from "../../data"

export type InputBoardValueResource = Readonly<{
    type: InputBoardValueType
    input: InputBoardValueAction
}>

export interface InputBoardValueAction {
    linkStore(store: BoardValueStore): void

    addInputHandler(handler: InputBoardValueHandler): void
    triggerInputEvent(): void

    get(): BoardValue
    set(value: BoardValue): void
    clear(): void
}
export interface InputBoardValueHandler {
    (): void
}
