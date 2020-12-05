import { View } from "./view"
import {
    RenewCredentialFactory,
    RenewCredentialCollector,
    PasswordLoginFactory,
    PasswordLoginCollector,
    PasswordResetSessionFactory,
    PasswordResetFactory,
    PasswordResetCollector,
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

export type Collector = Readonly<{
    login: {
        getLoginView(): ViewState
    }
}> &
    RenewCredentialCollector &
    PasswordLoginCollector &
    PasswordResetCollector

export function initLoginAsSingle(factory: Factory, collector: Collector): LoginEntryPoint {
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
