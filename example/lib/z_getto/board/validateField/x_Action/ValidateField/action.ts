import { ApplicationStateAction } from "../../../../application/action"

import { ConvertBoardFieldMethod, ValidateBoardFieldMethod } from "../../method"

import { BoardFieldValidateResult, boardFieldValidateResult_ok } from "../../data"
import { BoardConvertResult } from "../../../kernel/data"

export interface ValidateBoardFieldAction<T, E>
    extends ApplicationStateAction<ValidateBoardFieldState<E>> {
    readonly name: string
    get(): BoardConvertResult<T>
    check(): void
}

export type ValidateBoardFieldMaterial<T, E> = Readonly<{
    convert: ConvertBoardFieldMethod<T>
    validate: ValidateBoardFieldMethod<E>
}>

export type ValidateBoardFieldState<E> = BoardFieldValidateResult<E>
export const initialValidateBoardFieldState = boardFieldValidateResult_ok
