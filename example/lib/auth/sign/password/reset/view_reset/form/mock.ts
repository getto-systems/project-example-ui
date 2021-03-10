import { mockInputLoginIDAction } from "../../../../common/fields/login_id/action_input/core/mock"
import { initMockInputPasswordAction } from "../../../../common/fields/password/action/core/mock"
import { mockValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/action_validate_board/core/mock"

import { ResetPasswordFormAction } from "./action"

import { emptyBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockResetPasswordFormAction(): ResetPasswordFormAction {
    return {
        loginID: mockInputLoginIDAction(),
        password: initMockInputPasswordAction(emptyBoardValue, { multiByte: false }),
        validate: mockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
