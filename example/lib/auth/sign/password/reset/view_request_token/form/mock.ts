import { mockInputLoginIDAction } from "../../../../common/fields/login_id/action_input/core/mock"
import { mockValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/action_validate_board/core/mock"

import { RequestResetTokenFormAction } from "./action"

export function mockRequestResetTokenFormAction(): RequestResetTokenFormAction {
    return {
        loginID: mockInputLoginIDAction(),
        validate: mockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
