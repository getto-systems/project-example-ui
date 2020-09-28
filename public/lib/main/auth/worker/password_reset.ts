import { initPasswordResetWorkerComponent } from "../../../auth/component/password_reset/impl"

import { AuthBackground } from "../../../auth/usecase"

import { PasswordResetComponent } from "../../../auth/component/password_reset/component"

export function newPasswordResetComponent(background: AuthBackground): PasswordResetComponent {
    return initPasswordResetWorkerComponent(
        background,
        () => new Worker("./auth/password_reset.js"),
    )
}
