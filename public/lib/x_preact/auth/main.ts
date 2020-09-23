import { h, VNode } from "preact"
import { useState, useEffect } from "preact/hooks"

import { RenewCredential } from "./renew_credential"
import { StoreCredential } from "./store_credential"
import { LoadApplication } from "./load_application"

import { PasswordLogin } from "./password_login"
import { PasswordResetSession } from "./password_reset_session"
import { PasswordReset } from "./password_reset"

import { AuthUsecase } from "../../auth/component"
import { initialAuthState } from "../../auth/data"

export function Main(usecase: AuthUsecase) {
    return (): VNode => {
        const [state, setState] = useState(initialAuthState)
        useEffect(() => {
            usecase.onStateChange(setState)
            return () => usecase.terminate()
        }, [])

        // TODO useErrorBoundary とか使ってエラーの処理をする

        switch (state.type) {
            case "renew-credential":
                return h(RenewCredential(usecase.component.renewCredential), {})

            case "store-credential":
                return h(StoreCredential(usecase.component.storeCredential, state.authCredential), {})

            case "load-application":
                return h(LoadApplication(usecase.component.loadApplication), {})

            case "password-login":
                return h(PasswordLogin(usecase.component.passwordLogin), {})

            case "password-reset-session":
                return h(PasswordResetSession(usecase.component.passwordResetSession), {})

            case "password-reset":
                return h(PasswordReset(usecase.component.passwordReset, state.resetToken), {})
        }
    }
}
