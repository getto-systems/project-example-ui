import {
    PasswordResetSessionBackgroundAction,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "./resource"

import { PasswordResetSessionMaterial } from "./Session/component"
import { PasswordResetSessionFormMaterial } from "./Form/component"

import { initPasswordResetSessionFormComponent } from "./Form/impl"
import { initPasswordResetSessionComponent } from "./Session/impl"

export function initPasswordResetSessionResource(
    foreground: PasswordResetSessionForegroundAction,
    background: PasswordResetSessionBackgroundAction
): PasswordResetSessionResource {
    return {
        session: initPasswordResetSessionComponent(core()),
        form: initPasswordResetSessionFormComponent(form()),
    }

    function core(): PasswordResetSessionMaterial {
        return {
            link: foreground.link(),
            startSession: background.resetSession.startSession(),
            checkStatus: background.resetSession.checkStatus(),
        }
    }
    function form(): PasswordResetSessionFormMaterial {
        return {
            validation: foreground.form.core.validation(),
            history: foreground.form.core.history(),
            loginID: foreground.form.loginID.field(),
        }
    }
}
