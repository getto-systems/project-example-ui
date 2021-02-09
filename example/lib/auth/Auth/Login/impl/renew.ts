import { RenewCredentialResource } from "../entryPoint"

import {
    RenewCredentialComponent,
    RenewCredentialComponentFactory,
    RenewCredentialMaterial,
} from "../../renewCredential/component"

import { ApplicationAction, SecureScriptPathLocationInfo } from "../../../common/application/action"
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
export type RenewCredentialLocationInfo = Readonly<{
    application: SecureScriptPathLocationInfo
}>
export function initRenewCredentialResource(
    factory: RenewCredentialFactory,
    locationInfo: RenewCredentialLocationInfo,
    setup: Setup<RenewCredentialComponent>
): RenewCredentialResource {
    const material: RenewCredentialMaterial = {
        renew: factory.actions.renew.renew(),
        forceRenew: factory.actions.renew.forceRenew(),
        setContinuousRenew: factory.actions.setContinuousRenew.setContinuousRenew(),
        secureScriptPath: factory.actions.application.secureScriptPath(locationInfo.application),
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
