import { initLoginIDBoardResource } from "../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initPasswordBoardResource } from "../../../../../../common/board/password/x_Action/Password/impl"

import { initValidateBoardAction } from "../../../../../../../common/vendor/getto-board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../common/vendor/getto-board/validateBoard/infra"
import { ValidateBoardFieldInfra } from "../../../../../../../common/vendor/getto-board/validateField/infra"
import { InputBoardValueInfra } from "../../../../../../../common/vendor/getto-board/input/infra"

import { AuthenticatePasswordFormResource } from "./action"

export type AuthenticatePasswordFormBase = ValidateBoardInfra &
    ValidateBoardFieldInfra &
    InputBoardValueInfra

export function initAuthenticatePasswordFormResource(
    infra: AuthenticatePasswordFormBase
): AuthenticatePasswordFormResource {
    const loginID = initLoginIDBoardResource({ name: "loginID" }, infra)
    const password = initPasswordBoardResource({ name: "password" }, infra)
    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name, password.validate.name],
            converter: () => {
                loginID.validate.check()
                password.validate.check()

                const loginIDResult = loginID.validate.get()
                const passwordResult = password.validate.get()
                if (!loginIDResult.success || !passwordResult.success) {
                    return { success: false }
                }
                return {
                    success: true,
                    value: {
                        loginID: loginIDResult.value,
                        password: passwordResult.value,
                    },
                }
            },
        },
        infra
    )

    loginID.input.addInputHandler(() => validate.check())
    password.input.addInputHandler(() => validate.check())    

    return { loginID, password, validate }
}
