import { ApplicationAbstractAction } from "../../../../z_getto/application/impl"

import {
    AuthSignAction,
    AuthSignActionState,
    AuthSignViewType,
    AuthSignViewLocationInfo,
    AuthSignSubEntryPoint,
    AuthSignEntryPoint,
} from "./entryPoint"

import { authSignSearchVariant_password_reset } from "../../../../auth/sign/common/searchParams/data"

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

const viewTypes = {
    reset: {
        request: "password-reset-requestToken",
        checkStatus: "password-reset-checkStatus",
        reset: "password-reset",
    },
} as const

function detectViewState(currentURL: URL): AuthSignViewType {
    // パスワードリセット
    const password_reset = viewType_password_reset()
    if (password_reset.found) {
        return password_reset.viewType
    }

    // 特に指定が無ければパスワードログイン
    return "password-authenticate"

    type ViewTypeResult =
        | Readonly<{ found: false }>
        | Readonly<{ found: true; viewType: AuthSignViewType }>

    function viewType_password_reset(): ViewTypeResult {
        const reset = authSignSearchVariant_password_reset()
        const search = currentURL.searchParams.get(reset.key)
        if (search) {
            const variant = reset.variant(search)
            if (variant.found) {
                return { found: true, viewType: viewTypes.reset[variant.key] }
            }
        }
        return { found: false }
    }
}

export class View extends ApplicationAbstractAction<AuthSignActionState> implements AuthSignAction {
    locationInfo: AuthSignViewLocationInfo
    // TODO もう components ではない
    components: AuthSignSubEntryPoint

    constructor(locationInfo: AuthSignViewLocationInfo, components: AuthSignSubEntryPoint) {
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
            case "password-authenticate":
                return { type, entryPoint: this.components.password_authenticate() }
            case "password-reset-requestToken":
                return { type, entryPoint: this.components.password_reset_requestToken() }
            case "password-reset-checkStatus":
                return { type, entryPoint: this.components.password_reset_checkStatus() }
            case "password-reset":
                return { type, entryPoint: this.components.password_reset() }
        }
    }
}
