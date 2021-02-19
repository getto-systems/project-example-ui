import { initMockPropsPasser } from "../../../../../../../common/vendor/getto-example/Application/mock"

import {
    initMockValidateBoardAction,
    ValidateBoardMockPropsPasser,
} from "../../../../../../../common/vendor/getto-board/validateBoard/x_Action/ValidateBoard/mock"
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
    }
}
