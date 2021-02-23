import { newClearInfra } from "../../init"

import { initLogoutAction } from "./impl"

import { LogoutAction } from "./action"

export function newLogoutAction(webStorage: Storage): LogoutAction {
    return initLogoutAction(newClearInfra(webStorage))
}
