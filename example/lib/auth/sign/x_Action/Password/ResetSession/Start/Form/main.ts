import { initFormAction } from "../../../../../../../z_getto/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../../common/field/loginID/main/loginID"

import { initStartPasswordResetSessionFormAction } from "./impl"

import { StartPasswordResetSessionFormAction } from "./action"

export function newStartPasswordResetSessionFormAction(): StartPasswordResetSessionFormAction {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    return initStartPasswordResetSessionFormAction({
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
    })
}
