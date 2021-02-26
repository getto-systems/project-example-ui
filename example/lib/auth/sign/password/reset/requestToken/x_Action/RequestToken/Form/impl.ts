import { newBoardValidateStack } from "../../../../../../../../z_vendor/getto-application/board/kernel/infra/stack"

import { initLoginIDBoardFieldAction } from "../../../../../../common/board/loginID/x_Action/LoginID/impl"
import { initValidateBoardAction } from "../../../../../../../../z_vendor/getto-application/board/validateBoard/x_Action/ValidateBoard/impl"

import { ValidateBoardInfra } from "../../../../../../../../z_vendor/getto-application/board/kernel/infra"

import { FormAction } from "./action"

import { BoardConvertResult } from "../../../../../../../../z_vendor/getto-application/board/kernel/data"
import { RequestTokenFields } from "../../../data"

export function initFormAction(): FormAction {
    const infra: ValidateBoardInfra = { stack: newBoardValidateStack() }
    const loginID = initLoginIDBoardFieldAction({ name: "loginID" }, infra)
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
