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

import { ViewState, LoginResource } from "../view"

export type FactorySet = RenewCredentialFactorySet &
    PasswordLoginFactorySet &
    PasswordResetSessionFactorySet &
    PasswordResetFactorySet

export type CollectorSet = Readonly<{
    login: {
        getLoginView(): ViewState
    }
}> &
    RenewCredentialCollectorSet &
    PasswordLoginCollectorSet &
    PasswordResetCollectorSet

export function initLoginAsSingle(factory: FactorySet, collector: CollectorSet): LoginResource {
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
