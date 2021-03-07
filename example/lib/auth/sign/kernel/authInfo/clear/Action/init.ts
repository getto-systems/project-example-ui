import { newClearAuthInfoInfra } from "../impl/init"

import { toLogoutResource } from "./impl"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./Core/impl"

import { LogoutResource } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
}>
export function newLogoutResource(feature: OutsideFeature): LogoutResource {
    const { webStorage } = feature
    return toLogoutResource(
        initLogoutCoreAction(initLogoutCoreMaterial(newClearAuthInfoInfra(webStorage))),
    )
}
