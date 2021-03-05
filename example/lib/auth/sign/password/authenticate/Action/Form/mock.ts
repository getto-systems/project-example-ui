import { initMockInputLoginIDAction } from "../../../../common/fields/loginID/input/Action/Core/mock"
import { initMockInputPasswordAction } from "../../../../common/fields/password/input/Action/Core/mock"
import { initMockValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/mock"

import { AuthenticatePasswordFormAction } from "./action"

import { emptyBoardValue } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockAuthenticatePasswordFormAction(): AuthenticatePasswordFormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        password: initMockInputPasswordAction(emptyBoardValue, { multiByte: false }),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
