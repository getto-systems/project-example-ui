import {
    PasswordResetBackgroundActionPod,
    PasswordResetForegroundAction,
    PasswordResetLocationInfo,
    PasswordResetResource,
} from "./resource"

import { FormMaterial } from "./Form/component"

import { initResetComponent } from "./Reset/impl"
import { initFormComponent } from "./Form/impl"
import { initRegisterAction } from "../../../sign/password/reset/register/impl"

export function initPasswordResetResource(
    locationInfo: PasswordResetLocationInfo,
    foreground: PasswordResetForegroundAction,
    background: PasswordResetBackgroundActionPod
): PasswordResetResource {
    return {
        reset: initResetComponent({
            ...foreground,
            register: initRegisterAction(locationInfo, background.initRegister),
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
