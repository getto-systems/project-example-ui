import { initMockValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/mock"
import { initMockLoginIDBoardFieldAction } from "../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockPasswordBoardFieldAction } from "../../../../../common/board/password/x_Action/Password/mock"

import { FormAction } from "./action"

import { emptyBoardValue } from "../../../../../../../z_vendor/getto-application/board/kernel/data"

export function initMockFormAction(): FormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        password: initMockPasswordBoardFieldAction(emptyBoardValue, { multiByte: false }),
        validate: initMockValidateBoardAction(),
        clear: () => null,
        terminate: () => null,
    }
}
