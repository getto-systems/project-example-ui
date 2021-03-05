import { initMockInputLoginIDAction } from "../../../../../common/fields/loginID/input/Action/Core/mock"
import { initMockValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/mock"

import { RequestResetTokenFormAction } from "./action"

export function initMockRequestResetTokenFormAction(): RequestResetTokenFormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
