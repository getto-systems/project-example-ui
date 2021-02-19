import { ApplicationAction } from "../../../../getto-example/Application/action"

import { ConvertBoardMethod, ValidateBoardMethod } from "../../method"

import { BoardValidateState, boardValidateState_initial } from "../../data"
import { BoardConvertResult } from "../../../kernel/data"

export interface ValidateBoardAction<T> extends ApplicationAction<ValidateBoardState> {
    get(): BoardConvertResult<T>
    check(): void
}

export type ValidateBoardMaterial<T> = Readonly<{
    convert: ConvertBoardMethod<T>
    validate: ValidateBoardMethod
}>

export type ValidateBoardState = BoardValidateState
export const initialValidateBoardState: ValidateBoardState = boardValidateState_initial
