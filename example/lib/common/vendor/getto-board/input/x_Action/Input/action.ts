import { ApplicationAction } from "../../../../getto-example/Application/action"

import { ClearBoardValueMethod, SetBoardValueMethod } from "../../method"

import { InputBoardValueEvent } from "../../event"

import { BoardValue, emptyBoardValue } from "../../../kernel/data"
import { InputBoardValueType } from "../../data"

export type InputBoardValueResource = Readonly<{
    input: InputBoardValueAction
}>

export interface InputBoardValueAction extends ApplicationAction<InputBoardValueState> {
    readonly type: InputBoardValueType

    addInputHandler(handler: InputBoardValueHandler): void

    get(): BoardValue
    set(value: BoardValue): void
    clear(): void
}
export interface InputBoardValueHandler {
    (): void
}

export type InputBoardValueMaterial = Readonly<{
    set: SetBoardValueMethod
    clear: ClearBoardValueMethod
}>

export type InputBoardValueState = InputBoardValueEvent

export const initialInputBoardState: InputBoardValueState = emptyBoardValue
