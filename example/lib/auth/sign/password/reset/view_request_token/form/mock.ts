import { initMockInputLoginIDAction } from "../../../../common/fields/login_id/action/core/mock"
import { initMockValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/action_validate_board/core/mock"

import { RequestResetTokenFormAction } from "./action"

export function initMockRequestResetTokenFormAction(): RequestResetTokenFormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
