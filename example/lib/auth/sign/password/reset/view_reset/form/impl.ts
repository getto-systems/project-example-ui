import { initInputLoginIDAction } from "../../../../common/fields/login_id/action/core/impl"
import { initInputPasswordAction } from "../../../../common/fields/password/action/core/impl"
import { initValidateBoardAction } from "../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/impl"

import { ResetPasswordFormAction, ResetPasswordFieldsEnum } from "./action"

import { ResetPasswordFields } from "../../reset/data"
import { ConvertBoardResult } from "../../../../../../z_vendor/getto-application/board/kernel/data"

export function initResetPasswordFormAction(): ResetPasswordFormAction {
    const loginID = initInputLoginIDAction()
    const password = initInputPasswordAction()
    const validate = initValidateBoardAction({
        fields: Object.keys(ResetPasswordFieldsEnum),
        converter,
    })

    loginID.validate.subscriber.subscribe(validate.updateValidateState("loginID"))
    password.validate.subscriber.subscribe(validate.updateValidateState("password"))

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

    function converter(): ConvertBoardResult<ResetPasswordFields> {
        const loginIDResult = loginID.validate.get()
        const passwordResult = password.validate.get()
        if (!loginIDResult.valid || !passwordResult.valid) {
            return { valid: false }
        }
        return {
            valid: true,
            value: {
                loginID: loginIDResult.value,
                password: passwordResult.value,
            },
        }
    }
}
