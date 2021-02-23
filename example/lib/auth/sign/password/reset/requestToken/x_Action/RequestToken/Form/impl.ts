import { RequestPasswordResetTokenFormAction } from "./action"

import { initLoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../../z_getto/board/validateBoard/infra"
import { ValidateBoardFieldInfra } from "../../../../../../../../z_getto/board/validateField/infra"
import { BoardConvertResult } from "../../../../../../../../z_getto/board/kernel/data"
import { PasswordResetRequestFields } from "../../../data"

export type RequestPasswordResetTokenFormBase = ValidateBoardInfra & ValidateBoardFieldInfra

export function initRequestPasswordResetTokenFormAction(
    infra: RequestPasswordResetTokenFormBase,
): RequestPasswordResetTokenFormAction {
    const loginID = initLoginIDBoardFieldAction({ name: "loginID" }, infra)
    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name],
            converter,
        },
        infra,
    )

    loginID.input.subscribeInputEvent(() => validate.check())

    return {
        loginID,
        validate,
        clear: () => loginID.clear(),
        terminate: () => loginID.terminate(),
    }

    function converter(): BoardConvertResult<PasswordResetRequestFields> {
        loginID.validate.check()

        const loginIDResult = loginID.validate.get()
        if (!loginIDResult.success) {
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
