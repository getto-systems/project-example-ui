import { initMockInputLoginIDAction } from "../../../../../../common/loginID/board/Action/Core/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/mock"

import { FormAction } from "./action"

export function initMockFormAction(): FormAction {
    return {
        loginID: initMockInputLoginIDAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
