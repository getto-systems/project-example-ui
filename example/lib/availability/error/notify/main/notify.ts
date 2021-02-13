import { env } from "../../../../y_environment/env"

import { initApiAvailableNotify } from "../../../../z_external/api/available/notify"

import { initNotifyConnectRemoteAccess } from "../impl/remote/notify/connect"

import { notify } from "../impl/core"

import { NotifyAction } from "../action"

export function initNotifyAction(): NotifyAction {
    return {
        notify: notify({
            notify: initNotifyConnectRemoteAccess(initApiAvailableNotify(env.apiServerURL)),
        }),
    }
}
