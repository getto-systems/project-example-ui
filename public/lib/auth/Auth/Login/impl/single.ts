import { View } from "./view"
import {
    RenewCredentialFactory,
    RenewCredentialCollectorSet,
    PasswordLoginFactory,
    PasswordLoginCollectorSet,
    PasswordResetSessionFactory,
    PasswordResetFactory,
    PasswordResetCollectorSet,
    initRenewCredentialResource,
    initPasswordLoginResource,
    initPasswordResetSessionResource,
    initPasswordResetResource,
} from "./core"

import { ViewState, LoginEntryPoint } from "../view"

export type Factory = RenewCredentialFactory &
    PasswordLoginFactory &
    PasswordResetSessionFactory &
    PasswordResetFactory

export type CollectorSet = Readonly<{
    login: {
        getLoginView(): ViewState
    }
}> &
    RenewCredentialCollectorSet &
    PasswordLoginCollectorSet &
    PasswordResetCollectorSet

export function initLoginAsSingle(factory: Factory, collector: CollectorSet): LoginEntryPoint {
    return {
        view: new View(collector, {
            renewCredential: (setup) => initRenewCredentialResource(factory, collector, setup),

            passwordLogin: () => initPasswordLoginResource(factory, collector),
            passwordResetSession: () => initPasswordResetSessionResource(factory),
            passwordReset: () => initPasswordResetResource(factory, collector),
        }),
        terminate: () => {
            // worker とインターフェイスを合わせるために必要
        },
    }
}
