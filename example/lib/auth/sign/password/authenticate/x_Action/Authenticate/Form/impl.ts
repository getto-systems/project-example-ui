import { newBoardValidateStack } from "../../../../../../../z_vendor/getto-application/board/kernel/infra/stack"

import { initLoginIDBoardFieldAction } from "../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initPasswordBoardFieldAction } from "../../../../../common/board/password/x_Action/Password/impl"

import { initValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../z_vendor/getto-application/board/kernel/infra"

import { FormAction } from "./action"

import { BoardConvertResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { AuthenticateFields } from "../../../data"

export function initFormAction(): FormAction {
    const infra: ValidateBoardInfra = { stack: newBoardValidateStack() }
    const loginID = initLoginIDBoardFieldAction({ name: "loginID" }, infra)
    const password = initPasswordBoardFieldAction({ name: "password" }, infra)

    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name, password.validate.name],
            converter,
        },
        infra,
    )

    loginID.resource.input.subscribeInputEvent(() => validate.check())
    password.resource.input.subscribeInputEvent(() => validate.check())

    return {
        loginID,
        password,
        validate,
        clear: () => {
            loginID.clear()
            password.clear()
        },
        terminate: () => {
            loginID.terminate()
            password.terminate()
            validate.terminate()
        },
    }

    function converter(): BoardConvertResult<AuthenticateFields> {
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
    }
}
