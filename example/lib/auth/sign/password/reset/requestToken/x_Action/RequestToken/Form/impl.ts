import { initValidateBoardInfra } from "../../../../../../../../z_vendor/getto-application/board/kernel/impl"

import { initInputLoginIDAction } from "../../../../../../common/board/loginID/Action/Core/impl"
import { initValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/impl"

import { FormAction } from "./action"

import { BoardConvertResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestTokenFields } from "../../../data"

export function initFormAction(): FormAction {
    const infra = initValidateBoardInfra()
    const loginID = initInputLoginIDAction(infra)
    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name],
            converter,
        },
        infra,
    )

    loginID.resource.input.subscribeInputEvent(() => validate.check())

    return {
        loginID,
        validate,
        clear: () => loginID.clear(),
        terminate: () => loginID.terminate(),
    }

    function converter(): BoardConvertResult<RequestTokenFields> {
        const loginIDResult = loginID.validate.get()
        if (!loginIDResult.valid) {
            return { success: false }
        }
        return {
            success: true,
            value: {
                loginID: loginIDResult.value,
            },
        }
    }
}
