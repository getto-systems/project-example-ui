import {
    initMockValidateBoardAction,
    ValidateBoardMockPropsPasser,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"
import { initMockLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockPasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/mock"

import { initialInputBoardState } from "../../../../../../../z_getto/board/input/x_Action/Input/action"
import { AuthenticatePasswordFormAction } from "./action"

export function initMockAuthenticatePasswordFormAction(
    passer: ValidateBoardMockPropsPasser
): AuthenticatePasswordFormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(),
        password: initMockPasswordBoardFieldAction(initialInputBoardState, { multiByte: false }),
        validate: initMockValidateBoardAction(passer),
        clear: () => null,
    }
}
