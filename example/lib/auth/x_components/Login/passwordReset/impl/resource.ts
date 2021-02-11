import {
    PasswordResetBackgroundAction,
    PasswordResetForegroundAction,
    PasswordResetLocationInfo,
    PasswordResetResource,
} from "../resource"

import { PasswordResetFormMaterial, PasswordResetMaterial } from "../component"
import { initPasswordResetComponent } from "./reset"
import { initPasswordResetFormComponent } from "./form"

export function initPasswordResetResource(
    locationInfo: PasswordResetLocationInfo,
    foreground: PasswordResetForegroundAction,
    background: PasswordResetBackgroundAction
): PasswordResetResource {
    return {
        reset: initPasswordResetComponent(core()),
        form: initPasswordResetFormComponent(form()),
    }

    function core(): PasswordResetMaterial {
        return {
            link: foreground.link(),
            reset: background.reset.reset(locationInfo.reset),
            setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
        }
    }
    function form(): PasswordResetFormMaterial {
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
