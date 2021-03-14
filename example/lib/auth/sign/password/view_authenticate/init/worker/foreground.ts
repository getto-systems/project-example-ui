import { newAuthenticatePasswordCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../auth_info/start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../common/secure/get_script_path/impl/init"

import { initAuthenticatePasswordEntryPoint } from "../../impl"

import {
    AuthenticatePasswordCoreForegroundInfra,
    initAuthenticatePasswordCoreAction,
} from "../../core/impl"
import { initAuthenticatePasswordFormAction } from "../../form/impl"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    AuthenticatePasswordProxyMaterial,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "./message"

import { AuthenticatePasswordEntryPoint } from "../../entry_point"
import { AuthenticatePasswordCoreAction } from "../../core/action"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export interface AuthenticatePasswordProxy
    extends WorkerProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse> {
    entryPoint(feature: OutsideFeature): AuthenticatePasswordEntryPoint
}
export function newAuthenticatePasswordProxy(
    post: Post<AuthenticatePasswordProxyMessage>,
): AuthenticatePasswordProxy {
    return new Proxy(post)
}

class Proxy
    extends WorkerAbstractProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse>
    implements AuthenticatePasswordProxy {
    material: AuthenticatePasswordProxyMaterial

    constructor(post: Post<AuthenticatePasswordProxyMessage>) {
        super(post)
        this.material = {
            authenticate: this.method("authenticate", (message) => message),
        }
    }

    entryPoint(feature: OutsideFeature): AuthenticatePasswordEntryPoint {
        const { webStorage, currentLocation } = feature
        const foreground = newAuthenticatePasswordCoreForegroundMaterial(
            webStorage,
            currentLocation,
        )
        return buildAuthenticatePasswordEntryPoint(
            initAuthenticatePasswordCoreAction({
                authenticate: (fields, post) => this.material.authenticate.call({ fields }, post),
                ...foreground,
            }),
        )
    }
    resolve(response: AuthenticatePasswordProxyResponse): void {
        switch (response.method) {
            case "authenticate":
                this.material.authenticate.resolve(response)
                break
        }
    }
}

export function newAuthenticatePasswordCoreForegroundInfra(
    webStorage: Storage,
): AuthenticatePasswordCoreForegroundInfra {
    return {
        startContinuousRenew: newStartContinuousRenewAuthnInfoInfra(webStorage),
        getSecureScriptPath: newGetSecureScriptPathInfra(),
    }
}

export function buildAuthenticatePasswordEntryPoint(
    core: AuthenticatePasswordCoreAction,
): AuthenticatePasswordEntryPoint {
    return initAuthenticatePasswordEntryPoint({ core, form: initAuthenticatePasswordFormAction() })
}

interface Post<M> {
    (message: M): void
}
