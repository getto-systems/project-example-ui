import { initPasswordResetSessionWorkerComponent } from "../../../auth/component/password_reset_session/impl"

import { PasswordResetSessionComponent } from "../../../auth/component/password_reset_session"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    return initPasswordResetSessionWorkerComponent(
        () => new Worker("./auth/password_reset_session.js"),
    )
}
