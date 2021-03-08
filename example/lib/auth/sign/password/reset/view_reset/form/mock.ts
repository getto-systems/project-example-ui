import { initMockInputLoginIDAction } from "../../../../common/fields/login_id/action/core/mock"
import { initMockInputPasswordAction } from "../../../../common/fields/password/action/core/mock"
import { initMockValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/action_validate_board/core/mock"

import { ResetPasswordFormAction } from "./action"

import { emptyBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockResetPasswordFormAction(): ResetPasswordFormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        password: initMockInputPasswordAction(emptyBoardValue, { multiByte: false }),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
