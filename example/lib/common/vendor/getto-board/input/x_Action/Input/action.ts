import { ApplicationAction } from "../../../../getto-example/Application/action"

import { ClearBoardMethod, SetBoardValueMethod } from "../../method"

import { InputBoardEvent } from "../../event"

import { BoardValue, emptyBoardValue, EmptyBoardValue } from "../../../kernel/data"

export type InputBoardResource = Readonly<{
    input: InputBoardAction
}>

export interface InputBoardAction extends ApplicationAction<InputBoardState> {
    set(value: BoardValue): void
    clear(): void
}

export type InputBoardMaterial = Readonly<{
    set: SetBoardValueMethod
    clear: ClearBoardMethod
}>

export type InputBoardState =
    | Readonly<{ type: "initial-board"; value: EmptyBoardValue }>
    | InputBoardEvent

export const initialInputBoardState: InputBoardState = {
    type: "initial-board",
    value: emptyBoardValue,
}
