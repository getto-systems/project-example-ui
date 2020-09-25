import { newPasswordResetAction } from "./action/password_reset"

import {
    initPasswordResetSessionComponent,
    initPasswordResetSessionWorkerComponentHelper,
} from "../../auth/component/password_reset_session/impl"

import { initLoginIDFieldAction } from "../../field/login_id/impl/core"

import {
    PasswordResetSessionComponent,
    PasswordResetSessionWorkerComponentHelper,
} from "../../auth/component/password_reset_session/component"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    return initPasswordResetSessionComponent({
        passwordReset: newPasswordResetAction(),
        loginIDField: initLoginIDFieldAction(),
    })
}

export function newWorkerHelper(): PasswordResetSessionWorkerComponentHelper {
    return initPasswordResetSessionWorkerComponentHelper()
}
