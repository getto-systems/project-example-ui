import { initFormAction } from "../../../../../../common/vendor/getto-form/main/form"
import { initLoginIDFormFieldAction } from "../../../../../common/field/loginID/main/loginID"
import { initPasswordFormFieldAction } from "../../../../../common/field/password/main/password"
import { initAuthenticatePasswordFormAction } from "./impl"

import { AuthenticatePasswordFormAction } from "./action"

export function newAuthenticatePasswordFormAction(): AuthenticatePasswordFormAction {
    const form = initFormAction()
    const loginID = initLoginIDFormFieldAction()
    const password = initPasswordFormFieldAction()
    return initAuthenticatePasswordFormAction({
        validation: form.validation(),
        history: form.history(),
        loginID: loginID.field(),
        password: password.field(),
        character: password.character(),
        viewer: password.viewer(),
    })
}
