import { View } from "./view"
import {
    RenewCredentialFactorySet,
    RenewCredentialCollectorSet,
    PasswordLoginFactorySet,
    PasswordLoginCollectorSet,
    PasswordResetSessionFactorySet,
    PasswordResetFactorySet,
    PasswordResetCollectorSet,
    initRenewCredentialComponentSet,
    initPasswordLoginComponentSet,
    initPasswordResetSessionComponentSet,
    initPasswordResetComponentSet,
} from "./core"

import { LoginState, AuthResource } from "../view"

export type FactorySet = RenewCredentialFactorySet &
    PasswordLoginFactorySet &
    PasswordResetSessionFactorySet &
    PasswordResetFactorySet

export type CollectorSet = Readonly<{
    auth: {
        getLoginView(): LoginState
    }
}> &
    RenewCredentialCollectorSet &
    PasswordLoginCollectorSet &
    PasswordResetCollectorSet

export function initAuthAsSingle(factory: FactorySet, collector: CollectorSet): AuthResource {
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
