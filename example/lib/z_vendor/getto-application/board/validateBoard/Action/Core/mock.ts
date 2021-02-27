import { ApplicationMockStateAction } from "../../../../action/impl"
import { ConvertBoardResult } from "../../../kernel/data"
import { initialValidateBoardState, ValidateBoardAction, ValidateBoardActionState } from "./action"

export function initMockValidateBoardAction<N extends string, T>(): ValidateBoardAction<N, T> {
    return new Action()
}

class Action<N extends string, T>
    extends ApplicationMockStateAction<ValidateBoardActionState>
    implements ValidateBoardAction<N, T> {
    readonly initialState: ValidateBoardActionState = initialValidateBoardState

    updateValidateState() {
        return () => null
    }
    get(): ConvertBoardResult<T> {
        return { valid: false }
    }
}
