import { ApplicationBaseComponent } from "../../../vendor/getto-example/Application/impl"

import {
    AuthSignView,
    AuthSignViewState,
    AuthSignViewType,
    PasswordLoginEntryPoint,
    PasswordResetSessionEntryPoint,
    PasswordResetEntryPoint,
    AuthSignViewLocationInfo,
    AuthSignResourceFactory,
} from "./entryPoint"

import { AuthLocationSearchParams } from "../../sign/authLocation/data"

export function initLoginViewLocationInfo(currentURL: URL): AuthSignViewLocationInfo {
    return {
        getAuthSignViewType: () => detectViewState(currentURL),
    }
}

function detectViewState(currentURL: URL): AuthSignViewType {
    // パスワードリセット
    switch (currentURL.searchParams.get(AuthLocationSearchParams.passwordReset)) {
        case AuthLocationSearchParams.passwordReset_start:
            return "password-reset-session"
        case AuthLocationSearchParams.passwordReset_reset:
            return "password-reset"
    }

    // 特に指定が無ければパスワードログイン
    return "password-login"
}

export class View extends ApplicationBaseComponent<AuthSignViewState> implements AuthSignView {
    locationInfo: AuthSignViewLocationInfo
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

    passwordLogin(): PasswordLoginEntryPoint {
        const resource = { ...this.components.passwordLogin(), ...this.components.link() }
        return {
            resource,
            terminate: () => {
                resource.login.terminate()
                resource.form.terminate()
            },
        }
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
