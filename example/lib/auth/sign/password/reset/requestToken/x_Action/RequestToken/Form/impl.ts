import { initInputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/impl"
import { initValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/impl"

import { FormAction, RequestPasswordResetTokenFieldsEnum } from "./action"

import { ConvertBoardResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestTokenFields } from "../../../data"

export function initFormAction(): FormAction {
    const loginID = initInputLoginIDAction()
    const validate = initValidateBoardAction({
        fields: Object.keys(RequestPasswordResetTokenFieldsEnum),
        converter,
    })

    loginID.validate.subscriber.subscribe(validate.updateValidateState("loginID"))

    return {
        loginID,
        validate,
        clear: () => loginID.clear(),
        terminate: () => loginID.terminate(),
    }

    function converter(): ConvertBoardResult<RequestTokenFields> {
        const loginIDResult = loginID.validate.get()
        if (!loginIDResult.valid) {
            return { valid: false }
        }
        return {
            valid: true,
            value: {
                loginID: loginIDResult.value,
            },
        }
    }
}
