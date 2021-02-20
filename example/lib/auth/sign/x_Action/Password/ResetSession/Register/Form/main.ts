import { initFormAction } from "../../../../../../../z_getto/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../../../common/field/password/main/password"

import { initRegisterPasswordFormAction } from "./impl"

import { RegisterPasswordFormAction } from "./action"

export function newRegisterPasswordFormAction(): RegisterPasswordFormAction {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    const password = initPasswordFormFieldAction()
    return initRegisterPasswordFormAction({
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
        password: password.field(),
        character: password.character(),
        viewer: password.viewer(),
    })
}
