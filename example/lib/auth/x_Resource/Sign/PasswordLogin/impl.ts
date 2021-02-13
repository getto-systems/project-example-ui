import { initFormComponent } from "./Form/impl"
import { initLoginComponent } from "./Login/impl"

import {
    PasswordLoginBackgroundAction,
    PasswordLoginForegroundActionPod,
    PasswordLoginLocationInfo,
    PasswordLoginResource,
} from "./resource"

import { LoginMaterial } from "./Login/component"
import { FormMaterial } from "./Form/component"
import { initContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/impl"

export function initPasswordLoginResource(
    locationInfo: PasswordLoginLocationInfo,
    foreground: PasswordLoginForegroundActionPod,
    background: PasswordLoginBackgroundAction
): PasswordLoginResource {
    return {
        login: initLoginComponent(loginMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function loginMaterial(): LoginMaterial {
        return {
            continuousRenew: initContinuousRenewAction(foreground.initContinuousRenew),

            secureScriptPath: foreground.application.secureScriptPath(locationInfo.application),
            login: background.login.login(),
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
