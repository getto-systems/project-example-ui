import { ApplicationAction } from "../../../../getto-example/Application/action"

import { ValidateBoardMethod } from "../../method"

import { ValidateBoardEvent } from "../../event"

import { emptyBoardValue, EmptyBoardValue } from "../../../kernel/data"

export type ValidateBoardResource<E> = Readonly<{
    validate: ValidateBoardAction<E>
}>

export interface ValidateBoardAction<E> extends ApplicationAction<ValidateBoardState<E>> {
    check(): void
}

export type ValidateBoardMaterial<E> = Readonly<{
    validate: ValidateBoardMethod<E>
}>

export type ValidateBoardState<E> =
    | Readonly<{ type: "initial-board"; value: EmptyBoardValue }>
    | ValidateBoardEvent<E>

export const initialValidateBoardState = {
    type: "initial-board",
    value: emptyBoardValue,
} as const
