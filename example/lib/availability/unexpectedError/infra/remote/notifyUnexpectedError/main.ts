import { env } from "../../../../../y_environment/env"

import { initApiAvailableNotify } from "../../../../../z_external/api/availability/notify"

import { initNotifyUnexpectedErrorConnectRemoteAccess } from "./connect"

import { NotifyUnexpectedErrorRemoteAccess } from "../../../infra"

export function newNotifyUnexpectedErrorRemoteAccess(): NotifyUnexpectedErrorRemoteAccess {
    return initNotifyUnexpectedErrorConnectRemoteAccess(initApiAvailableNotify(env.apiServerURL))
}
