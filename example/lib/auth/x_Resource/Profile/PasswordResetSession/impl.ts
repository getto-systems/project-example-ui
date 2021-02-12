import {
    PasswordResetSessionBackgroundAction,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "./resource"

import { SessionMaterial } from "./Session/component"
import { FormMaterial } from "./Form/component"

import { initFormComponent } from "./Form/impl"
import { initSessionComponent } from "./Session/impl"

export function initPasswordResetSessionResource(
    foreground: PasswordResetSessionForegroundAction,
    background: PasswordResetSessionBackgroundAction
): PasswordResetSessionResource {
    return {
        session: initSessionComponent(session()),
        form: initFormComponent(form()),
    }

    function session(): SessionMaterial {
        return {
            startSession: background.resetSession.startSession(),
            checkStatus: background.resetSession.checkStatus(),
        }
    }
    function form(): FormMaterial {
        return {
            validation: foreground.form.core.validation(),
            history: foreground.form.core.history(),
            loginID: foreground.form.loginID.field(),
        }
    }
}
