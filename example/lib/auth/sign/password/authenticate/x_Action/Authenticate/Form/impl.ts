import { initValidateBoardInfra } from "../../../../../../../z_vendor/getto-application/board/kernel/impl"

import { initInputLoginIDAction } from "../../../../../common/board/loginID/Action/Core/impl"
import { initInputPasswordAction } from "../../../../../common/board/password/Action/Core/impl"
import { initValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/impl"

import { FormAction } from "./action"

import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { AuthenticateFields } from "../../../data"

export function initFormAction(): FormAction {
    const infra = initValidateBoardInfra()
    const loginID = initInputLoginIDAction(infra)
    const password = initInputPasswordAction(infra)

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

    function converter(): ConvertBoardResult<AuthenticateFields> {
        const loginIDResult = loginID.validate.get()
        const passwordResult = password.validate.get()
        if (!loginIDResult.valid || !passwordResult.valid) {
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
