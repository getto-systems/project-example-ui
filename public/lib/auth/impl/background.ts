import { View } from "./view"
import {
    initRenewCredentialComponentSet,
    initPasswordLoginComponentSet,
    initPasswordResetSessionComponentSet,
    initPasswordResetComponentSet,
} from "./core"

import { AppHrefInit } from "../../href"
import { AuthInit } from "../view"

import { RenewCredentialInit } from "../component/renew_credential/component"
import { PasswordLoginInit } from "../component/password_login/component"
import { PasswordResetSessionInit } from "../component/password_reset_session/component"
import { PasswordResetInit } from "../component/password_reset/component"

import { LoginIDFieldInit } from "../component/field/login_id/component"
import { PasswordFieldInit } from "../component/field/password/component"

import { SecureScriptPathAction } from "../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../credential/action"

import { LoginAction, LoginFieldCollector } from "../../password_login/action"
import {
    StartSessionAction,
    StartSessionFieldCollector,
    PollingStatusAction,
    ResetAction,
    ResetFieldCollector,
} from "../../password_reset/action"

import { LoginIDFieldAction } from "../../login_id/field/action"
import { PasswordFieldAction } from "../../password/field/action"

export type FactorySet = Readonly<{
    application: {
        secureScriptPath: Factory<SecureScriptPathAction>
    }
    credential: {
        renew: Factory<RenewAction>
        setContinuousRenew: Factory<SetContinuousRenewAction>
        store: Factory<StoreAction>
    }

    passwordLogin: {
        login: ParameterizedFactory<LoginFieldCollector, LoginAction>
    }
    passwordReset: {
        startSession: ParameterizedFactory<StartSessionFieldCollector, StartSessionAction>
        pollingStatus: Factory<PollingStatusAction>
        reset: ParameterizedFactory<ResetFieldCollector, ResetAction>
    }

    field: {
        loginID: Factory<LoginIDFieldAction>
        password: Factory<PasswordFieldAction>
    }
}>

export type InitSet = Readonly<{
    href: AppHrefInit

    renewCredential: RenewCredentialInit

    passwordLogin: PasswordLoginInit
    passwordResetSession: PasswordResetSessionInit
    passwordReset: PasswordResetInit

    field: {
        loginID: LoginIDFieldInit
        password: PasswordFieldInit
    }
}>

export function initAuthInitAsBackground(factory: FactorySet, init: InitSet): AuthInit {
    return (currentLocation) => {
        return {
            view: new View(currentLocation, {
                renewCredential: (param, setup) =>
                    initRenewCredentialComponentSet(factory, init, param, setup),

                passwordLogin: (param) => initPasswordLoginComponentSet(factory, init, param),
                passwordResetSession: () => initPasswordResetSessionComponentSet(factory, init),
                passwordReset: (param) => initPasswordResetComponentSet(factory, init, param),
            }),
            terminate: () => {
                // worker とインターフェイスを合わせるために必要
            },
        }
    }
}

interface Factory<T> {
    (): T
}
interface ParameterizedFactory<P, T> {
    (param: P): T
}
