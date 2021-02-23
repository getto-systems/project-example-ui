import { initMockLoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { RequestPasswordResetTokenFormAction } from "./action"

export function initMockRequestPasswordResetTokenFormAction(): RequestPasswordResetTokenFormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
