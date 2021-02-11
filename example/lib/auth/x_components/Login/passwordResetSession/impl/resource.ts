import { PasswordResetSessionFormMaterial, PasswordResetSessionMaterial } from "../component"
import { PasswordResetSessionBackgroundAction, PasswordResetSessionForegroundAction, PasswordResetSessionResource } from "../resource"
import { initPasswordResetSessionFormComponent } from "./form"
import { initPasswordResetSessionComponent } from "./resetSession"

export function initPasswordResetSessionResource(
    foreground: PasswordResetSessionForegroundAction,
    background: PasswordResetSessionBackgroundAction
): PasswordResetSessionResource {
    return {
        resetSession: initPasswordResetSessionComponent(core()),
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
