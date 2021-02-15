import { initFormComponent } from "./Form/impl"
import { initLoginComponent } from "./Login/impl"

import {
    PasswordLoginBackgroundActionPod,
    PasswordLoginForegroundAction,
    PasswordLoginResource,
} from "./resource"

import { FormMaterial } from "./Form/component"
import { initLoginAction } from "../../../sign/password/login/impl"

export function initPasswordLoginResource(
    foreground: PasswordLoginForegroundAction,
    background: PasswordLoginBackgroundActionPod
): PasswordLoginResource {
    return {
        login: initLoginComponent({
            ...foreground,
            login: initLoginAction(background.initLogin),
        }),
        form: initFormComponent(formMaterial()),
    }

    function formMaterial(): FormMaterial {
        return {
            validation: foreground.form.core.validation(),
            history: foreground.form.core.history(),
            loginID: foreground.form.loginID.field(),
            password: foreground.form.password.field(),
            character: foreground.form.password.character(),
            viewer: foreground.form.password.viewer(),
        }
    }
}
