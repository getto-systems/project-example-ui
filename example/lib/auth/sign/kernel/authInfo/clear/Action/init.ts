import { newClearAuthInfoInfra } from "../impl/init"

import { toLogoutResource } from "./impl"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./Core/impl"

import { LogoutResource } from "./resource"

export function newLogoutResource(webStorage: Storage): LogoutResource {
    return toLogoutResource(initLogoutCoreAction(initLogoutCoreMaterial(newClearAuthInfoInfra(webStorage))))
}
