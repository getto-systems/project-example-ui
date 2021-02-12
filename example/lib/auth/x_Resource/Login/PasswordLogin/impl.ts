import { initFormComponent } from "./Form/impl"
import { initLoginComponent } from "./Login/impl"

import {
    PasswordLoginBackgroundAction,
    PasswordLoginForegroundAction,
    PasswordLoginLocationInfo,
    PasswordLoginResource,
} from "./resource"

import { LoginMaterial } from "./Login/component"
import { FormMaterial } from "./Form/component"

export function initPasswordLoginResource(
    locationInfo: PasswordLoginLocationInfo,
    foreground: PasswordLoginForegroundAction,
    background: PasswordLoginBackgroundAction
): PasswordLoginResource {
    return {
        login: initLoginComponent(login()),
        form: initFormComponent(form()),
    }

    function login(): LoginMaterial {
        return {
            setContinuousRenew: foreground.setContinuousRenew.setContinuousRenew(),
            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
            login: background.login.login(),
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
