import { initFormComponent } from "./Form/impl"
import { initLoginComponent } from "./Login/impl"

import {
    PasswordLoginBackgroundActionPod,
    PasswordLoginForegroundAction,
    PasswordLoginLocationInfo,
    PasswordLoginResource,
} from "./resource"

import { LoginMaterial } from "./Login/component"
import { FormMaterial } from "./Form/component"
import { initLocationAction } from "../../../sign/location/impl"
import { initLoginAction } from "../../../sign/password/login/impl"

export function initPasswordLoginResource(
    locationInfo: PasswordLoginLocationInfo,
    foreground: PasswordLoginForegroundAction,
    background: PasswordLoginBackgroundActionPod
): PasswordLoginResource {
    return {
        login: initLoginComponent(loginMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function loginMaterial(): LoginMaterial {
        return {
            ...foreground,
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
