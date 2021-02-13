import {
    PasswordResetSessionBackgroundAction,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "./resource"

import { StartMaterial } from "./Start/component"
import { FormMaterial } from "./Form/component"

import { initFormComponent } from "./Form/impl"
import { initStartComponent } from "./Start/impl"

export function initPasswordResetSessionResource(
    foreground: PasswordResetSessionForegroundAction,
    background: PasswordResetSessionBackgroundAction
): PasswordResetSessionResource {
    return {
        start: initStartComponent(startMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function startMaterial(): StartMaterial {
        return {
            startSession: background.resetSession.startSession(),
            checkStatus: background.resetSession.checkStatus(),
        }
    }
    function formMaterial(): FormMaterial {
        return {
            validation: foreground.form.core.validation(),
            history: foreground.form.core.history(),
            loginID: foreground.form.loginID.field(),
        }
    }
}
