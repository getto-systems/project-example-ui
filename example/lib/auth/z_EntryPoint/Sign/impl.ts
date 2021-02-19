import { ApplicationAbstractAction } from "../../../common/vendor/getto-example/Application/impl"

import {
    AuthSignView,
    AuthSignViewState,
    AuthSignViewType,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
    AuthSignViewLocationInfo,
    AuthSignResourceFactory,
} from "./entryPoint"

import { AuthSignSearchParams } from "../../sign/common/searchParams/data"
import { AuthenticatePasswordEntryPoint } from "../../sign/password/authenticate/x_Action/Authenticate/action"

export function initLoginViewLocationInfo(currentURL: URL): AuthSignViewLocationInfo {
    return {
        getAuthSignViewType: () => detectViewState(currentURL),
    }
}

function detectViewState(currentURL: URL): AuthSignViewType {
    // パスワードリセット
    switch (currentURL.searchParams.get(AuthSignSearchParams.passwordReset)) {
        case AuthSignSearchParams.passwordReset_start:
            return "password-reset-session"
        case AuthSignSearchParams.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}

export class View extends ApplicationAbstractAction<AuthSignViewState> implements AuthSignView {
    locationInfo: AuthSignViewLocationInfo
    // TODO もう components ではない 
    components: AuthSignResourceFactory

    constructor(locationInfo: AuthSignViewLocationInfo, components: AuthSignResourceFactory) {
        super()
        this.locationInfo = locationInfo
        this.components = components
    }

    load(): void {
        const resource = this.components.renew()
        resource.renew.addStateHandler((state) => {
            switch (state.type) {
                case "required-to-login":
                    this.post(this.mapViewType(this.locationInfo.getAuthSignViewType()))
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

    mapViewType(type: AuthSignViewType): AuthSignViewState {
        switch (type) {
            case "password-login":
                return { type, entryPoint: this.passwordLogin() }
            case "password-reset-session":
                return { type, entryPoint: this.passwordResetSession() }
            case "password-reset":
                return { type, entryPoint: this.passwordReset() }
        }
    }

    passwordLogin(): AuthenticatePasswordEntryPoint {
        return this.components.passwordLogin()
    }
    passwordResetSession(): PasswordResetSessionEntryPoint {
        const resource = { ...this.components.passwordResetSession(), ...this.components.link() }
        return {
            resource,
            terminate: () => {
                resource.start.terminate()
                resource.form.terminate()
            },
        }
    }
    passwordReset(): PasswordResetEntryPoint {
        const resource = { ...this.components.passwordReset(), ...this.components.link() }
        return {
            resource,
            terminate: () => {
                resource.register.terminate()
                resource.form.terminate()
            },
        }
    }
}
