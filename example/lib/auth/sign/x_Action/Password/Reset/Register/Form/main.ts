import { initFormAction } from "../../../../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../../../common/field/password/main/password"

import { initRegisterPasswordResetSessionFormAction } from "./impl"

import { RegisterPasswordResetSessionFormAction } from "./action"

export function newRegisterPasswordResetSessionFormAction(): RegisterPasswordResetSessionFormAction {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    const password = initPasswordFormFieldAction()
    return initRegisterPasswordResetSessionFormAction({
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
        password: password.field(),
        character: password.character(),
        viewer: password.viewer(),
    })
}
