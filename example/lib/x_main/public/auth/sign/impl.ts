import { ApplicationAbstractAction } from "../../../../z_getto/application/impl"

import {
    AuthSignView,
    AuthSignViewState,
    AuthSignViewType,
    PasswordResetSessionEntryPoint,
    AuthSignViewLocationInfo,
    AuthSignResourceFactory,
} from "./entryPoint"

import { AuthSignSearchParams } from "../../../../auth/sign/common/searchParams/data"
import { AuthenticatePasswordEntryPoint } from "../../../../auth/sign/password/authenticate/x_Action/Authenticate/action"
import { RegisterPasswordEntryPoint } from "../../../../auth/sign/password/resetSession/register/x_Action/Register/action"

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

        this.igniteHook(() => {
            const entryPoint = this.components.renew()
            entryPoint.resource.renew.addStateHandler((state) => {
                switch (state.type) {
                    case "required-to-login":
                        this.post(this.mapViewType(this.locationInfo.getAuthSignViewType()))
                        return
                }
            })

            this.post({ type: "renew-credential", entryPoint })
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
    passwordReset(): RegisterPasswordEntryPoint {
        return this.components.passwordReset()
    }
}
