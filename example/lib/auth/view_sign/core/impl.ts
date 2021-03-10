import { ApplicationAbstractStateAction } from "../../../z_vendor/getto-application/action/impl"

import { SignViewLocationDetecter, SignViewType } from "../../sign/view/view"

import { initialSignViewState, SignAction, SignActionState, SignSubEntryPoint } from "./action"

import { ConvertLocationResult } from "../../../z_vendor/getto-application/location/data"

export function initSignAction(
    detecter: SignViewLocationDetecter,
    entryPoints: SignSubEntryPoint,
): SignAction {
    return new Action(detecter, entryPoints)
}

class Action extends ApplicationAbstractStateAction<SignActionState> implements SignAction {
    readonly initialState = initialSignViewState

    detecter: SignViewLocationDetecter
    entryPoints: SignSubEntryPoint

    constructor(detecter: SignViewLocationDetecter, components: SignSubEntryPoint) {
        super()
        this.detecter = detecter
        this.entryPoints = components

        this.igniteHook(() => {
            const entryPoint = this.entryPoints.renew()

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

    mapViewType(result: ConvertLocationResult<SignViewType>): SignActionState {
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
