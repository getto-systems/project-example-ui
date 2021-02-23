import { initLoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initPasswordBoardFieldAction } from "../../../../../../../common/board/password/x_Action/Password/impl"
import { initValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../../z_getto/board/validateBoard/infra"
import { ValidateBoardFieldInfra } from "../../../../../../../../z_getto/board/validateField/infra"

import { ResetPasswordFormAction } from "./action"
import { PasswordResetFields } from "../../../data"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"

export type ResetPasswordFormBase = ValidateBoardInfra & ValidateBoardFieldInfra

export function initResetPasswordFormAction(infra: ResetPasswordFormBase): ResetPasswordFormAction {
    const loginID = initLoginIDBoardFieldAction({ name: "loginID" }, infra)
    const password = initPasswordBoardFieldAction({ name: "password" }, infra)
    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name, password.validate.name],
            converter,
        },
        infra,
    )

    loginID.input.subscribeInputEvent(() => validate.check())
    password.input.subscribeInputEvent(() => validate.check())

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
        },
    }

    function converter(): BoardConvertResult<PasswordResetFields> {
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
