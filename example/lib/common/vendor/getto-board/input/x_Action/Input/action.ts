import { ApplicationAction } from "../../../../getto-example/Application/action"

import { ClearBoardMethod, SetBoardValueMethod } from "../../method"

import { InputBoardEvent } from "../../event"

import { BoardValue, BoardValue_empty, emptyBoardValue } from "../../../kernel/data"
import { BoardInputType } from "../../data"

export type InputBoardResource = Readonly<{
    input: InputBoardAction
}>

export interface InputBoardAction extends ApplicationAction<InputBoardState> {
    readonly type: BoardInputType

    addInputHandler(handler: BoardInputHandler): void

    get(): BoardValue
    set(value: BoardValue): void
    clear(): void
}
export interface BoardInputHandler {
    (): void
}

export type InputBoardMaterial = Readonly<{
    set: SetBoardValueMethod
    clear: ClearBoardMethod
}>

export type InputBoardState =
    | Readonly<{ type: "initial-board"; value: BoardValue_empty }>
    | InputBoardEvent

export const initialInputBoardState: InputBoardState = {
    type: "initial-board",
    value: emptyBoardValue,
}
