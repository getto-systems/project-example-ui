import { newClearInfra } from "../../init"

import { toLogoutResource } from "./impl"

import { LogoutResource } from "./action"
import { initCoreAction, initCoreMaterial } from "./Core/impl"

export function newLogoutResource(webStorage: Storage): LogoutResource {
    return toLogoutResource(initCoreAction(initCoreMaterial(newClearInfra(webStorage))))
}
