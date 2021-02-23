import { initMockLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { FormAction } from "./action"

export function initMockFormAction(): FormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
