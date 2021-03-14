import { newClearAuthTicketInfra } from "../clear/impl/init"

import { initLogoutResource } from "./impl"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./core/impl"

import { LogoutResource } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
}>
export function newLogoutResource(feature: OutsideFeature): LogoutResource {
    const { webStorage } = feature
    return initLogoutResource(
        initLogoutCoreAction(initLogoutCoreMaterial(newClearAuthTicketInfra(webStorage))),
    )
}
