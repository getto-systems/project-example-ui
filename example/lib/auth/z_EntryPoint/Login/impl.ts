import { ApplicationBaseComponent } from "../../../sub/getto-example/Application/impl"
import { AuthSearchParams } from "../../common/searchParams/data"

import {
    LoginView,
    LoginState,
    ViewState,
    PasswordLoginEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
    LoginViewLocationInfo,
    LoginResourceFactory,
} from "./entryPoint"

export function initLoginViewLocationInfo(currentURL: URL): LoginViewLocationInfo {
    return {
        login: {
            getLoginView: () => detectViewState(currentURL),
        },
    }
}

function detectViewState(currentURL: URL): ViewState {
    // パスワードリセット
    switch (currentURL.searchParams.get(AuthSearchParams.passwordReset)) {
        case AuthSearchParams.passwordReset_start:
            return "password-reset-session"
        case AuthSearchParams.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}

export class View extends ApplicationBaseComponent<LoginState> implements LoginView {
    locationInfo: LoginViewLocationInfo
    components: LoginResourceFactory

    constructor(locationInfo: LoginViewLocationInfo, components: LoginResourceFactory) {
        super()
        this.locationInfo = locationInfo
        this.components = components
    }

    load(): void {
        const resource = this.components.renewCredential()
        resource.renew.addStateHandler((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapLoginView(this.locationInfo.login.getLoginView()))
                    return
            }
        })

        this.post({
            type: "renew-credential",
            entryPoint: {
                resource,
                terminate: () => {
                    resource.renew.terminate()
                },
            },
        })
    }
    error(err: string): void {
        this.post({ type: "error", err })
    }

    mapLoginView(loginView: ViewState): LoginState {
        switch (loginView) {
            case "password-login":
                return { type: loginView, entryPoint: this.passwordLogin() }
            case "password-reset-session":
                return { type: loginView, entryPoint: this.passwordResetSession() }
            case "password-reset":
                return { type: loginView, entryPoint: this.passwordReset() }
        }
    }

    passwordLogin(): PasswordLoginEntryPoint {
        const resource = { ...this.components.passwordLogin(), ...this.components.loginLink() }
        return {
            resource,
            terminate: () => {
                resource.login.terminate()
                resource.form.terminate()
            },
        }
    }
    passwordResetSession(): PasswordResetSessionEntryPoint {
        const resource = { ...this.components.passwordResetSession(), ...this.components.loginLink() }
        return {
            resource,
            terminate: () => {
                resource.session.terminate()
                resource.form.terminate()
            },
        }
    }
    passwordReset(): PasswordResetEntryPoint {
        const resource = { ...this.components.passwordReset(), ...this.components.loginLink() }
        return {
            resource,
            terminate: () => {
                resource.reset.terminate()
                resource.form.terminate()
            },
        }
    }
}
