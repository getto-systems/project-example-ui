import {
    PasswordResetBackgroundAction,
    PasswordResetForegroundAction,
    PasswordResetLocationInfo,
    PasswordResetResource,
} from "./resource"

import { ResetMaterial } from "./Reset/component"
import { FormMaterial } from "./Form/component"

import { initResetComponent } from "./Reset/impl"
import { initFormComponent } from "./Form/impl"

export function initPasswordResetResource(
    locationInfo: PasswordResetLocationInfo,
    foreground: PasswordResetForegroundAction,
    background: PasswordResetBackgroundAction
): PasswordResetResource {
    return {
        reset: initResetComponent(reset()),
        form: initFormComponent(form()),
    }

    function reset(): ResetMaterial {
        return {
            reset: background.reset.reset(locationInfo.reset),
            setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
        }
    }
    function form(): FormMaterial {
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
