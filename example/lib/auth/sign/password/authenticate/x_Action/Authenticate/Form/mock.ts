import { initMockPropsPasser } from "../../../../../../../z_getto/application/mock"

import {
    initMockValidateBoardAction,
    ValidateBoardMockPropsPasser,
} from "../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/mock"
import { initMockLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/mock"
import { initMockPasswordBoardFieldAction } from "../../../../../../common/board/password/x_Action/Password/mock"

import { AuthenticatePasswordFormAction } from "./action"

export function initMockAuthenticatePasswordFormAction(
    passer: ValidateBoardMockPropsPasser
): AuthenticatePasswordFormAction {
    return {
        loginID: initMockLoginIDBoardFieldAction(initMockPropsPasser()),
        password: initMockPasswordBoardFieldAction(initMockPropsPasser()),
        validate: initMockValidateBoardAction(passer),
        clear: () => null,
    }
}
