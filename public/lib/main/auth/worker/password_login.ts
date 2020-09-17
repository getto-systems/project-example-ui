import { initPasswordLoginWorkerComponent } from "../../../auth/password_login/impl"

import { PasswordLoginComponent } from "../../../auth/password_login/component"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    return initPasswordLoginWorkerComponent(
        () => new Worker("./auth/password_login.js"),
    )
}
