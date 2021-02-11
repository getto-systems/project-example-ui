import { initPasswordLoginFormComponent } from "./form"
import { initPasswordLoginComponent } from "./login"

import {
    PasswordLoginBackgroundAction,
    PasswordLoginForegroundAction,
    PasswordLoginLocationInfo,
    PasswordLoginResource,
} from "../resource"

import { PasswordLoginFormMaterial, PasswordLoginMaterial } from "../component"

export function initPasswordLoginResource(
    locationInfo: PasswordLoginLocationInfo,
    foreground: PasswordLoginForegroundAction,
    background: PasswordLoginBackgroundAction
): PasswordLoginResource {
    return {
        login: initPasswordLoginComponent(core()),
        form: initPasswordLoginFormComponent(form()),
    }

    function core(): PasswordLoginMaterial {
        return {
            link: foreground.link(),
            setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
            login: background.login.login(),
        }
    }
    function form(): PasswordLoginFormMaterial {
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
