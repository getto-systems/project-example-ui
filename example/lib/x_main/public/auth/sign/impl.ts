import { ApplicationAbstractAction } from "../../../../z_getto/application/impl"

import {
    AuthSignAction,
    AuthSignActionState,
    AuthSignViewType,
    AuthSignViewLocationInfo,
    AuthSignResourceFactory,
    AuthSignEntryPoint,
} from "./entryPoint"

import { AuthSignSearchParams } from "../../../../auth/sign/common/searchParams/data"

export function toAuthSignEntryPoint(action: AuthSignAction): AuthSignEntryPoint {
    return {
        resource: { view: action },
        terminate: () => {
            action.terminate()
        },
    }
}

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

export class View extends ApplicationAbstractAction<AuthSignActionState> implements AuthSignAction {
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

    mapViewType(type: AuthSignViewType): AuthSignActionState {
        switch (type) {
            case "password-login":
                return { type, entryPoint: this.components.passwordLogin() }
            case "password-reset-session":
                return { type, entryPoint: this.components.passwordResetSession() }
            case "password-reset":
                return { type, entryPoint: this.components.passwordReset() }
        }
    }
}
