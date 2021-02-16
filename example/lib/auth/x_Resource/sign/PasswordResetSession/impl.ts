import {
    PasswordResetSessionBackgroundActionPod,
    PasswordResetSessionForegroundAction,
    PasswordResetSessionResource,
} from "./resource"

import { PasswordResetSessionStartMaterial } from "../../../sign/x_Action/Password/Reset/Session/Start/component"
import { PasswordResetSessionFormMaterial } from "../../../sign/x_Action/Password/Reset/Session/Form/component"

import { initPasswordResetSessionFormComponent } from "../../../sign/x_Action/Password/Reset/Session/Form/impl"
import { initStartComponent } from "../../../sign/x_Action/Password/Reset/Session/Start/impl"
import { initPasswordResetSessionAction } from "../../../sign/password/resetSession/start/impl"

export function initPasswordResetSessionResource(
    foreground: PasswordResetSessionForegroundAction,
    background: PasswordResetSessionBackgroundActionPod
): PasswordResetSessionResource {
    return {
        start: initStartComponent(startMaterial()),
        form: initPasswordResetSessionFormComponent(formMaterial()),
    }

    function startMaterial(): PasswordResetSessionStartMaterial {
        return {
            session: initPasswordResetSessionAction(background.initSession),
        }
    }
    function formMaterial(): PasswordResetSessionFormMaterial {
        return {
            validation: foreground.form.core.validation(),
            history: foreground.form.core.history(),
            loginID: foreground.form.loginID.field(),
        }
    }
}
