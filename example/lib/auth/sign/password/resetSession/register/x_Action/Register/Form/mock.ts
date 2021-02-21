import { initMockLoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockPasswordBoardFieldAction } from "../../../../../../../common/board/password/x_Action/Password/mock"
import { initMockValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"

import { initialInputBoardState } from "../../../../../../../../z_getto/board/input/x_Action/Input/action"
import { RegisterPasswordFormAction } from "./action"

export function initMockRegisterPasswordFormAction(): RegisterPasswordFormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        password: initMockPasswordBoardFieldAction(initialInputBoardState, { multiByte: false }),
        validate: initMockValidateBoardAction(),
        clear: () => null,
    }
}
