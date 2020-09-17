import { initPasswordLoginWorkerComponent } from "../../../auth/password_login/core"

import { PasswordLoginComponent } from "../../../auth/password_login/action"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    return initPasswordLoginWorkerComponent(
        () => new Worker("./auth/password_login.js"),
    )
}
