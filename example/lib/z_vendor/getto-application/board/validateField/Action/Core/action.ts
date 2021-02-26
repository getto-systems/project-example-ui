import { ApplicationStateAction } from "../../../../action/action"

import { ConvertBoardFieldMethod } from "../../method"

import { ConvertBoardFieldResult } from "../../data"

export interface ValidateBoardFieldAction<T, E>
    extends ApplicationStateAction<ValidateBoardFieldState<E>> {
    readonly name: string
    get(): ConvertBoardFieldResult<T, E>
    check(): void
}

export type ValidateBoardFieldMaterial<T, E> = Readonly<{
    convert: ConvertBoardFieldMethod<T, E>
}>

export type ValidateBoardFieldState<E> =
    | Readonly<{ valid: true }>
    | Readonly<{ valid: false; err: E[] }>
