import { newAuthenticatePasswordCoreForegroundMaterial } from "../common"

import { newStartContinuousRenewAuthnInfoInfra } from "../../../../../kernel/authInfo/common/startContinuousRenew/impl/init"
import { newGetSecureScriptPathInfra } from "../../../../../common/secure/getScriptPath/impl/init"

import { toAuthenticatePasswordEntryPoint } from "../../impl"

import {
    AuthenticatePasswordCoreForegroundInfra,
    initAuthenticatePasswordCoreAction,
} from "../../Core/impl"
import { initAuthenticatePasswordFormAction } from "../../Form/impl"

import {
    WorkerProxy,
    WorkerAbstractProxy,
} from "../../../../../../../z_vendor/getto-application/action/worker/foreground"

import {
    AuthenticatePasswordProxyMaterial,
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "./message"

import { AuthenticatePasswordEntryPoint } from "../../entryPoint"
import { AuthenticatePasswordCoreAction } from "../../Core/action"

export interface AuthenticatePasswordProxy
    extends WorkerProxy<AuthenticatePasswordProxyMessage, AuthenticatePasswordProxyResponse> {
    entryPoint(webStorage: Storage, currentLocation: Location): AuthenticatePasswordEntryPoint
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

    entryPoint(webStorage: Storage, currentLocation: Location): AuthenticatePasswordEntryPoint {
        const foreground = newAuthenticatePasswordCoreForegroundMaterial(
            webStorage,
            currentLocation,
        )
        return initAuthenticatePasswordEntryPoint(
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

export function initAuthenticatePasswordEntryPoint(
    core: AuthenticatePasswordCoreAction,
): AuthenticatePasswordEntryPoint {
    return toAuthenticatePasswordEntryPoint({ core, form: initAuthenticatePasswordFormAction() })
}

interface Post<M> {
    (message: M): void
}
