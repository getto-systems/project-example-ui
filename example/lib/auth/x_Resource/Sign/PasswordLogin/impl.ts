import { initFormComponent } from "./Form/impl"
import { initLoginComponent } from "./Login/impl"

import {
    PasswordLoginBackgroundActionPod,
    PasswordLoginForegroundActionPod,
    PasswordLoginLocationInfo,
    PasswordLoginResource,
} from "./resource"

import { LoginMaterial } from "./Login/component"
import { FormMaterial } from "./Form/component"
import { initContinuousRenewAction } from "../../../sign/authCredential/continuousRenew/impl"
import { initLocationAction } from "../../../sign/location/impl"
import { initLoginAction } from "../../../sign/password/login/impl"

export function initPasswordLoginResource(
    locationInfo: PasswordLoginLocationInfo,
    foreground: PasswordLoginForegroundActionPod,
    background: PasswordLoginBackgroundActionPod
): PasswordLoginResource {
    return {
        login: initLoginComponent(loginMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function loginMaterial(): LoginMaterial {
        return {
            continuousRenew: initContinuousRenewAction(foreground.initContinuousRenew),
            login: initLoginAction(background.initLogin),
            location: initLocationAction(foreground.initLocation, locationInfo),
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
