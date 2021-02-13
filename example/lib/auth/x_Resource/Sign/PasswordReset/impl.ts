import {
    PasswordResetBackgroundAction,
    PasswordResetForegroundActionPod,
    PasswordResetLocationInfo,
    PasswordResetResource,
} from "./resource"

import { ResetMaterial } from "./Reset/component"
import { FormMaterial } from "./Form/component"

import { initResetComponent } from "./Reset/impl"
import { initFormComponent } from "./Form/impl"
import { initContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/impl"

export function initPasswordResetResource(
    locationInfo: PasswordResetLocationInfo,
    foreground: PasswordResetForegroundActionPod,
    background: PasswordResetBackgroundAction
): PasswordResetResource {
    return {
        reset: initResetComponent(resetMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function resetMaterial(): ResetMaterial {
        return {
            continuousRenew: initContinuousRenewAction(foreground.initContinuousRenew),

            reset: background.reset.reset(locationInfo.reset),
            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
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
