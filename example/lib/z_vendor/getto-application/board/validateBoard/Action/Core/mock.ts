import { ApplicationMockStateAction } from "../../../../action/impl"
import { ConvertBoardResult } from "../../../kernel/data"
import { initialValidateBoardState, ValidateBoardAction, ValidateBoardActionState } from "./action"

export const validateBoardOptions: ValidateBoardActionState[] = ["initial", "valid", "invalid"]

export function initMockValidateBoardAction<T>(): ValidateBoardAction<T> {
    return new Action()
}

class Action<T>
    extends ApplicationMockStateAction<ValidateBoardActionState>
    implements ValidateBoardAction<T> {
    readonly initialState: ValidateBoardActionState = initialValidateBoardState

    get(): ConvertBoardResult<T> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
