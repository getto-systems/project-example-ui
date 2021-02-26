import { ApplicationStateAction } from "../../../../action/action"

import { ConvertBoardMethod, ValidateBoardMethod } from "../../method"

import { ValidateBoardState } from "../../data"
import { ConvertBoardResult } from "../../../kernel/data"

export interface ValidateBoardAction<T> extends ApplicationStateAction<ValidateBoardActionState> {
    get(): ConvertBoardResult<T>
    check(): void
}

export type ValidateBoardMaterial<T> = Readonly<{
    convert: ConvertBoardMethod<T>
    validate: ValidateBoardMethod
}>

export type ValidateBoardActionState = ValidateBoardState
export const initialValidateBoardState: ValidateBoardActionState = "initial"
