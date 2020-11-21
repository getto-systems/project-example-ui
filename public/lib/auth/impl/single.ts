import { View } from "./view"
import {
    initRenewCredentialComponentSet,
    initPasswordLoginComponentSet,
    initPasswordResetSessionComponentSet,
    initPasswordResetComponentSet,
} from "./core"

import { AppHrefFactory } from "../../href/data"
import { AuthViewFactory } from "../view"

import { RenewCredentialComponentFactory } from "../component/renew_credential/component"
import { PasswordLoginComponentFactory } from "../component/password_login/component"
import { PasswordResetSessionComponentFactory } from "../component/password_reset_session/component"
import { PasswordResetComponentFactory } from "../component/password_reset/component"

import { LoginIDFieldComponentFactory } from "../component/field/login_id/component"
import { PasswordFieldComponentFactory } from "../component/field/password/component"

import { SecureScriptPathAction } from "../../application/action"
import { RenewAction, SetContinuousRenewAction, StoreAction } from "../../credential/action"

import { Login } from "../../password_login/action"
import { StartSession, PollingStatusAction, Reset } from "../../password_reset/action"

import { LoginIDFieldAction } from "../../login_id/field/action"
import { PasswordFieldAction } from "../../password/field/action"

export type FactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: Factory<SecureScriptPathAction>
        }>
        credential: Readonly<{
            renew: Factory<RenewAction>
            setContinuousRenew: Factory<SetContinuousRenewAction>
            store: Factory<StoreAction>
        }>

        passwordLogin: Readonly<{
            login: Login
        }>
        passwordReset: Readonly<{
            startSession: StartSession
            pollingStatus: Factory<PollingStatusAction>
            reset: Reset
        }>

        field: Readonly<{
            loginID: Factory<LoginIDFieldAction>
            password: Factory<PasswordFieldAction>
        }>
    }>
    components: Readonly<{
        href: AppHrefFactory

        renewCredential: RenewCredentialComponentFactory

        passwordLogin: PasswordLoginComponentFactory
        passwordResetSession: PasswordResetSessionComponentFactory
        passwordReset: PasswordResetComponentFactory

        field: Readonly<{
            loginID: LoginIDFieldComponentFactory
            password: PasswordFieldComponentFactory
        }>
    }>
}>

export function initAuthViewFactoryAsSingle(factory: FactorySet): AuthViewFactory {
    return (currentLocation) => {
        return {
            view: new View(currentLocation, {
                renewCredential: (param, setup) =>
                    initRenewCredentialComponentSet(factory, param, setup),

                passwordLogin: (param) => initPasswordLoginComponentSet(factory, param),
                passwordResetSession: () => initPasswordResetSessionComponentSet(factory),
                passwordReset: (param) => initPasswordResetComponentSet(factory, param),
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
