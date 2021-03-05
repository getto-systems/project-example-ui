import { initInputLoginIDAction } from "../../../../../common/fields/loginID/input/Action/Core/impl"
import { initInputPasswordAction } from "../../../../../common/fields/password/input/Action/Core/impl"
import { initValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/impl"

import { AuthenticatePasswordFieldsEnum, FormAction } from "./action"

import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { AuthenticateFields } from "../../../data"

export function initFormAction(): FormAction {
    const loginID = initInputLoginIDAction()
    const password = initInputPasswordAction()

    const validate = initValidateBoardAction({
        fields: Object.keys(AuthenticatePasswordFieldsEnum),
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
            validate.terminate()
        },
    }

    function converter(): ConvertBoardResult<AuthenticateFields> {
        const result = {
            loginID: loginID.validate.get(),
            password: password.validate.get()
        }
        if (!result.loginID.valid || !result.password.valid) {
            return { valid: false }
        }
        return {
            valid: true,
            value: {
                loginID: result.loginID.value,
                password: result.password.value,
            },
        }
    }
}
