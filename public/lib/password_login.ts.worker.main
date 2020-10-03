import { initPasswordLoginWorkerComponent } from "../../../auth/component/password_login/impl"

import { AuthBackground } from "../../../auth/usecase"

import { PasswordLoginComponent } from "../../../auth/component/password_login/component"

export function newPasswordLoginComponent(background: AuthBackground): PasswordLoginComponent {
    return initPasswordLoginWorkerComponent(
        background,
        () => new Worker("./auth/password_login.js"),
    )
}
