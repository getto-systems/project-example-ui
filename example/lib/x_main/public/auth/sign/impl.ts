import { ApplicationAbstractStateAction } from "../../../../z_vendor/getto-application/action/impl"

import { authSignViewSearchLocationConverter } from "./convert"

import {
    AuthSignAction,
    AuthSignActionState,
    AuthSignViewType,
    AuthSignViewLocationDetecter,
    AuthSignSubEntryPoint,
    AuthSignEntryPoint,
    AuthSignViewLocationKeys,
    AuthSignViewLocationDetectMethod,
} from "./entryPoint"

import { ConvertLocationResult } from "../../../../z_vendor/getto-application/location/detecter"

export function toAuthSignEntryPoint(action: AuthSignAction): AuthSignEntryPoint {
    return {
        resource: { view: action },
        terminate: () => {
            action.terminate()
        },
    }
}

const viewTypes = {
    reset: {
        requestToken: "password-reset-requestToken",
        checkStatus: "password-reset-checkStatus",
        reset: "password-reset",
    },
} as const

interface Detecter {
    (keys: AuthSignViewLocationKeys): AuthSignViewLocationDetectMethod
}
export const detectAuthSignViewType: Detecter = (keys) => (currentURL) => {
    const password_reset = authSignViewSearchLocationConverter(keys.password.reset, (key) =>
        currentURL.searchParams.get(key),
    )
    if (password_reset.valid) {
        return { valid: true, value: viewTypes.reset[password_reset.value] }
    }

    return { valid: false }
}

export class View
    extends ApplicationAbstractStateAction<AuthSignActionState>
    implements AuthSignAction {
    readonly initialState: AuthSignActionState = { type: "initial-view" }

    detecter: AuthSignViewLocationDetecter
    entryPoints: AuthSignSubEntryPoint

    constructor(detecter: AuthSignViewLocationDetecter, components: AuthSignSubEntryPoint) {
        super()
        this.detecter = detecter
        this.entryPoints = components

        this.igniteHook(() => {
            const entryPoint = this.entryPoints.renew()

            // TODO ここで subscriber を取得したくない。初期化時に hook を受け取るようにするべき
            entryPoint.resource.core.subscriber.subscribe((state) => {
                switch (state.type) {
                    case "required-to-login":
                        this.post(this.mapViewType(this.detecter()))
                        return
                }
            })

            this.post({ type: "renew-credential", entryPoint })
        })
    }

    error(err: string): void {
        this.post({ type: "error", err })
    }

    mapViewType(result: ConvertLocationResult<AuthSignViewType>): AuthSignActionState {
        if (!result.valid) {
            // 特に指定が無ければパスワードログイン
            return {
                type: "password-authenticate",
                entryPoint: this.entryPoints.password_authenticate(),
            }
        }

        const type = result.value
        switch (type) {
            case "password-reset-requestToken":
                return { type, entryPoint: this.entryPoints.password_reset_requestToken() }
            case "password-reset-checkStatus":
                return { type, entryPoint: this.entryPoints.password_reset_checkStatus() }
            case "password-reset":
                return { type, entryPoint: this.entryPoints.password_reset() }
        }
    }
}
