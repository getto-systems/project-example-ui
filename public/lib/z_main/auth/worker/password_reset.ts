import { initPasswordResetWorkerComponent } from "../../../auth/password_reset/core"

import { PasswordResetComponent } from "../../../auth/password_reset/action"

export function newPasswordResetComponent(): PasswordResetComponent {
    return initPasswordResetWorkerComponent(
        () => new Worker("./auth/password_reset.js"),
    )
}
