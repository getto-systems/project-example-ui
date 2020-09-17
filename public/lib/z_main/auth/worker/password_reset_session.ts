import { initPasswordResetSessionWorkerComponent } from "../../../auth/password_reset_session/core"

import { PasswordResetSessionComponent } from "../../../auth/password_reset_session/action"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    return initPasswordResetSessionWorkerComponent(
        () => new Worker("./auth/password_reset_session.js"),
    )
}
