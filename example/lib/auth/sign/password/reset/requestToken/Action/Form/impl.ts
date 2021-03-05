import { initInputLoginIDAction } from "../../../../../common/fields/loginID/input/Action/Core/impl"
import { initValidateBoardAction } from "../../../../../../../z_vendor/getto-application/board/validateBoard/Action/Core/impl"

import { RequestResetTokenFormAction, RequestResetTokenFieldsEnum } from "./action"

import { ConvertBoardResult } from "../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestResetTokenFields } from "../../data"

export function initRequestResetTokenFormAction(): RequestResetTokenFormAction {
    const loginID = initInputLoginIDAction()
    const validate = initValidateBoardAction({
        fields: Object.keys(RequestResetTokenFieldsEnum),
        converter,
    })

    loginID.validate.subscriber.subscribe(validate.updateValidateState("loginID"))

    return {
        loginID,
        validate,
        clear: () => loginID.clear(),
        terminate: () => loginID.terminate(),
    }

    function converter(): ConvertBoardResult<RequestResetTokenFields> {
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
