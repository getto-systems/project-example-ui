import { initMockLoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { StartPasswordResetSessionFormAction } from "./action"

export function initMockStartPasswordResetSessionFormAction(): StartPasswordResetSessionFormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
    }
}
