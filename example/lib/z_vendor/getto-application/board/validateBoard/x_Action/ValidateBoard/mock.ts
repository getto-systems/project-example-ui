import { ApplicationMockStateAction } from "../../../../action/impl"
import { BoardConvertResult } from "../../../kernel/data"
import { ValidateBoardAction, ValidateBoardState } from "./action"

export const validateBoardOptions: ValidateBoardState[] = ["initial", "valid", "invalid"]

export function initMockValidateBoardAction<T>(): ValidateBoardAction<T> {
    return new Action()
}

class Action<T>
    extends ApplicationMockStateAction<ValidateBoardState>
    implements ValidateBoardAction<T> {
    readonly initialState: ValidateBoardState = "initial"

    get(): BoardConvertResult<T> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
