import { initMockInputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/mock"

import { FormAction } from "./action"

export function initMockFormAction(): FormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
