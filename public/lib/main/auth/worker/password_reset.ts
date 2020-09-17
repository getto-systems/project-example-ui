import { initPasswordResetWorkerComponent } from "../../../auth/password_reset/impl"

import { PasswordResetComponent } from "../../../auth/password_reset/component"

export function newPasswordResetComponent(): PasswordResetComponent {
    return initPasswordResetWorkerComponent(
        () => new Worker("./auth/password_reset.js"),
    )
}
