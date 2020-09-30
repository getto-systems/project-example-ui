import { newPasswordResetAction } from "./action/password_reset"

import { initPasswordResetComponent, initPasswordResetWorkerComponentHelper } from "../../auth/component/password_reset/impl"

import { initLoginIDFieldAction } from "../../login_id/field/impl/core"
import { initPasswordFieldAction } from "../../password/field/impl/core"

import { AuthBackground } from "../../auth/usecase"

import { PasswordResetComponent, PasswordResetWorkerComponentHelper } from "../../auth/component/password_reset/component"

export function newPasswordResetComponent(background: AuthBackground): PasswordResetComponent {
    return initPasswordResetComponent(background, {
        passwordReset: newPasswordResetAction(),
        loginIDField: initLoginIDFieldAction(),
        passwordField: initPasswordFieldAction(),
    })
}

export function newWorkerHelper(): PasswordResetWorkerComponentHelper {
    return initPasswordResetWorkerComponentHelper()
}
