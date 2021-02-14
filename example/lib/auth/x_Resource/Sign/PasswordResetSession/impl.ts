import {
    PasswordResetSessionBackgroundActionPod,
    PasswordResetSessionForegroundActionPod,
    PasswordResetSessionResource,
} from "./resource"

import { StartMaterial } from "./Start/component"
import { FormMaterial } from "./Form/component"

import { initFormComponent } from "./Form/impl"
import { initStartComponent } from "./Start/impl"
import { initSessionAction } from "../../../sign/password/reset/session/impl"

export function initPasswordResetSessionResource(
    foreground: PasswordResetSessionForegroundActionPod,
    background: PasswordResetSessionBackgroundActionPod
): PasswordResetSessionResource {
    return {
        start: initStartComponent(startMaterial()),
        form: initFormComponent(formMaterial()),
    }

    function startMaterial(): StartMaterial {
        return {
            session: initSessionAction(background.initSession),
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
