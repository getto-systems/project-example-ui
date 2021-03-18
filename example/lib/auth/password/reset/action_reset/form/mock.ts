import { mockInputLoginIDAction } from "../../../../login_id/action_input/core/mock"
import { mockInputPasswordAction } from "../../../action_input/core/mock"
import { mockValidateBoardAction } from "../../../../../z_vendor/getto-application/board/action_validate_board/core/mock"

import { ResetPasswordFormAction } from "./action"

import { emptyBoardValue } from "../../../../../z_vendor/getto-application/board/kernel/data"

export function mockResetPasswordFormAction(): ResetPasswordFormAction {
    return {
        loginID: mockInputLoginIDAction(),
        password: mockInputPasswordAction(emptyBoardValue, { multiByte: false }),
        validate: mockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
