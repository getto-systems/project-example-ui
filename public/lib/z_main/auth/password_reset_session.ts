import { newPasswordResetAction } from "./action/password_reset"

import {
    initPasswordResetSessionComponent,
    initPasswordResetSessionWorkerComponentHelper,
} from "../../auth/password_reset_session/core"

import { initLoginIDFieldAction } from "../../field/login_id/impl/core"

import { PasswordResetSessionComponent, PasswordResetSessionWorkerComponentHelper } from "../../auth/password_reset_session/action"

export function newPasswordResetSessionComponent(): PasswordResetSessionComponent {
    return initPasswordResetSessionComponent({
        passwordReset: newPasswordResetAction(),
        loginIDField: initLoginIDFieldAction(),
    })
}

export function newWorkerHelper(): PasswordResetSessionWorkerComponentHelper {
    return initPasswordResetSessionWorkerComponentHelper()
}
