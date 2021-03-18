import { newAuthenticatePasswordCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../auth_ticket/start_continuous_renew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../common/secure/get_script_path/impl/init"

import { initAuthenticatePasswordView } from "../../impl"

import {
    AuthenticatePasswordCoreForegroundInfra,
    initAuthenticatePasswordCoreAction,
} from "../../core/impl"
import { initAuthenticatePasswordFormAction } from "../../form/impl"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    AuthenticatePasswordProxyMaterial,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "./message"

import { AuthenticatePasswordView } from "../../resource"
import { AuthenticatePasswordCoreAction } from "../../core/action"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export interface AuthenticatePasswordProxy
    extends WorkerProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse> {
    view(feature: OutsideFeature): AuthenticatePasswordView
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

    view(feature: OutsideFeature): AuthenticatePasswordView {
        const { webStorage, currentLocation } = feature
        const foreground = newAuthenticatePasswordCoreForegroundMaterial(
            webStorage,
            currentLocation,
        )
        return buildAuthenticatePasswordView(
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

export function buildAuthenticatePasswordView(
    core: AuthenticatePasswordCoreAction,
): AuthenticatePasswordView {
    return initAuthenticatePasswordView({ core, form: initAuthenticatePasswordFormAction() })
}

interface Post<M> {
    (message: M): void
}
