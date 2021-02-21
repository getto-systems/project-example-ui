import { MockAction_simple } from "../../../../application/mock"
import { BoardConvertResult } from "../../../kernel/data"
import { ValidateBoardAction, ValidateBoardState } from "./action"

export const validateBoardOptions: ValidateBoardState[] = ["initial", "valid", "invalid"]

export function initMockValidateBoardAction<T>(): ValidateBoardAction<T> {
    return new Action()
}

class Action<T> extends MockAction_simple<ValidateBoardState> implements ValidateBoardAction<T> {
    get(): BoardConvertResult<T> {
        return { success: false }
    }
    check() {
        // mock では特に何もしない
    }
}
