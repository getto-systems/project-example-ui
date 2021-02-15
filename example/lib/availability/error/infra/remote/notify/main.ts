import { env } from "../../../../../y_environment/env"

import { initApiAvailableNotify } from "../../../../../z_external/api/availability/notify"

import { initNotifyConnectRemoteAccess } from "./connect"

import { NotifyRemoteAccess } from "../../../infra"

export function newNotifyRemoteAccess(): NotifyRemoteAccess {
    return initNotifyConnectRemoteAccess(initApiAvailableNotify(env.apiServerURL))
}
