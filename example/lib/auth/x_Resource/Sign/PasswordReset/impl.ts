import {
    PasswordResetBackgroundActionPod,
    PasswordResetForegroundActionPod,
    PasswordResetLocationInfo,
    PasswordResetResource,
} from "./resource"

import { ResetMaterial } from "./Reset/component"
import { FormMaterial } from "./Form/component"

import { initResetComponent } from "./Reset/impl"
import { initFormComponent } from "./Form/impl"
import { initContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/impl"
import { initLocationAction } from "../../../sign/location/impl"
import { initRegisterAction } from "../../../sign/password/reset/register/impl"

export function initPasswordResetResource(
    locationInfo: PasswordResetLocationInfo,
    foreground: PasswordResetForegroundActionPod,
    background: PasswordResetBackgroundActionPod
): PasswordResetResource {
    return {
        reset: initResetComponent(resetMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function resetMaterial(): ResetMaterial {
        return {
            continuousRenew: initContinuousRenewAction(foreground.initContinuousRenew),
            location: initLocationAction(foreground.initLocation, locationInfo),
            register: initRegisterAction(background.initRegister, locationInfo),
        }
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
