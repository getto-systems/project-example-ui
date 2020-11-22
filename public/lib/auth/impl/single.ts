import { LoginView, View } from "./view"
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

import { SecureScriptPath } from "../../application/action"
import { Renew, SetContinuousRenew, Store } from "../../credential/action"

import { Login } from "../../password_login/action"
import { StartSession, CheckStatus, Reset } from "../../password_reset/action"

import { LoginIDField } from "../../login_id/field/action"
import { PasswordField } from "../../password/field/action"

import { PagePathname } from "../../application/data"
import { ResetToken } from "../../password_reset/data"

export type FactorySet = Readonly<{
    actions: Readonly<{
        application: Readonly<{
            secureScriptPath: SecureScriptPath
        }>
        credential: Readonly<{
            renew: Renew
            setContinuousRenew: SetContinuousRenew
            store: Store
        }>

        passwordLogin: Readonly<{
            login: Login
        }>
        passwordReset: Readonly<{
            startSession: StartSession
            checkStatus: CheckStatus
            reset: Reset
        }>

        field: Readonly<{
            loginID: LoginIDField
            password: PasswordField
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
export type CollectorSet = Readonly<{
    auth: Readonly<{
        getLoginView(): LoginView        
    }>
    application: Readonly<{
        getPagePathname(): PagePathname
    }>
    passwordReset: Readonly<{
        getResetToken(): ResetToken
    }>
}>

export function initAuthViewFactoryAsSingle(
    factory: FactorySet,
    collector: CollectorSet
): AuthViewFactory {
    return () => {
        return {
            view: new View(collector, {
                renewCredential: (setup) => initRenewCredentialComponentSet(factory, collector, setup),

                passwordLogin: () => initPasswordLoginComponentSet(factory, collector),
                passwordResetSession: () => initPasswordResetSessionComponentSet(factory),
                passwordReset: () => initPasswordResetComponentSet(factory, collector),
            }),
            terminate: () => {
                // worker とインターフェイスを合わせるために必要
            },
        }
    }
}
