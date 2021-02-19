import { ApplicationAction } from "../../../../getto-example/Application/action"

import { ValidateBoardMethod } from "../../method"

import { ValidateBoardEvent } from "../../event"

import { BoardConvertResult, boardValidateResult_ok, BoardValidateResult_ok } from "../../data"

export interface ValidateBoardAction<T, E> extends ApplicationAction<ValidateBoardState<E>> {
    get(): BoardConvertResult<T>
    check(): void
}

export type ValidateBoardMaterial<E> = Readonly<{
    validate: ValidateBoardMethod<E>
}>

export type ValidateBoardState<E> = ValidateBoardState_initial | ValidateBoardEvent<E>

type ValidateBoardState_initial = Readonly<{
    type: "initial-board"
    result: BoardValidateResult_ok
}>

export const initialValidateBoardState: ValidateBoardState_initial = {
    type: "initial-board",
    result: boardValidateResult_ok,
}
