import { RequestPasswordResetTokenFormAction } from "./action"

import { initLoginIDBoardFieldAction } from "../../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initValidateBoardAction } from "../../../../../../../../z_getto/board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../../z_getto/board/validateBoard/infra"
import { ValidateBoardFieldInfra } from "../../../../../../../../z_getto/board/validateField/infra"

export type RequestPasswordResetTokenFormBase = ValidateBoardInfra & ValidateBoardFieldInfra

export function initRequestPasswordResetTokenFormAction(
    infra: RequestPasswordResetTokenFormBase,
): RequestPasswordResetTokenFormAction {
    const loginID = initLoginIDBoardFieldAction({ name: "loginID" }, infra)
    const validate = initValidateBoardAction(
        {
            fields: [loginID.validate.name],
            converter: () => {
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
            },
        },
        infra,
    )

    loginID.input.addInputHandler(() => validate.check())

    return { loginID, validate, clear }

    function clear() {
        loginID.clear()
    }
}
