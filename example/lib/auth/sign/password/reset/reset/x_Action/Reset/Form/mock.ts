import { initMockInputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/mock"
import { initMockInputPasswordAction } from "../../../../../../common/board/password/Action/Core/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/mock"

import { FormAction } from "./action"

import { emptyBoardValue } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockFormAction(): FormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        password: initMockInputPasswordAction(emptyBoardValue, { multiByte: false }),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
