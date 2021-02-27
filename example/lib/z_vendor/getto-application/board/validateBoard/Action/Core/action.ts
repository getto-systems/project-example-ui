import { ApplicationStateAction } from "../../../../action/action"

import { ValidateBoardFieldStateHandler } from "../../../validateField/Action/Core/action"

import { UpdateBoardValidateStateMethod } from "../../method"

import { ValidateBoardState } from "../../data"
import { ConvertBoardResult } from "../../../kernel/data"

export interface ValidateBoardAction<N extends string, T>
    extends ApplicationStateAction<ValidateBoardActionState> {
    updateValidateState<E>(name: N): ValidateBoardFieldStateHandler<E>
    get(): ConvertBoardResult<T>
}

export type ValidateBoardMaterial<N extends string> = Readonly<{
    updateValidateState: UpdateBoardValidateStateMethod<N>
}>

export type ValidateBoardActionState = ValidateBoardState
export const initialValidateBoardState: ValidateBoardActionState = "initial"
