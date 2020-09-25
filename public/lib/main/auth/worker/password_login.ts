import { initPasswordLoginWorkerComponent } from "../../../auth/component/password_login/impl"

import { PasswordLoginComponent } from "../../../auth/component/password_login/component"

export function newPasswordLoginComponent(): PasswordLoginComponent {
    return initPasswordLoginWorkerComponent(
        () => new Worker("./auth/password_login.js"),
    )
}
