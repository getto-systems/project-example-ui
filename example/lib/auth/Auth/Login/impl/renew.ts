import { RenewCredentialResource } from "../entryPoint"

import {
    RenewCredentialComponent,
    RenewCredentialComponentFactory,
    RenewCredentialMaterial,
} from "../../renewCredential/component"

import { ApplicationAction, SecureScriptPathCollector } from "../../../common/application/action"
import { RenewAction, SetContinuousRenewAction } from "../../../login/renew/action"

export type RenewCredentialFactory = Readonly<{
    actions: Readonly<{
        application: ApplicationAction
        renew: RenewAction
        setContinuousRenew: SetContinuousRenewAction
    }>
    components: Readonly<{
        renewCredential: RenewCredentialComponentFactory
    }>
}>
export type RenewCredentialCollector = Readonly<{
    application: SecureScriptPathCollector
}>
export function initRenewCredentialResource(
    factory: RenewCredentialFactory,
    collector: RenewCredentialCollector,
    setup: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    const material: RenewCredentialMaterial = {
        renew: factory.actions.renew.renew(),
        forceRenew: factory.actions.renew.forceRenew(),
        setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
        secureScriptPath: factory.actions.application.secureScriptPath(collector.application),
    }

    const renewCredential = factory.components.renewCredential(material)
    setup(renewCredential)

    return {
        renewCredential,
    }
}

interface Setup<T> {
    (component: T): void
}
