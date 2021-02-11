import { env } from "../../../../../../y_environment/env"

import { initApiAvailableNotify } from "../../../../../../z_external/api/available/notify"

import { initNotifyConnectRemoteAccess } from "../../../../../notify/impl/remote/notify/connect"

import { notify } from "../../../../../notify/impl/core"

import { NotifyAction } from "../../../../../notify/action"

export function initNotifyAction(): NotifyAction {
    return {
        notify: notify({
            notify: initNotifyConnectRemoteAccess(initApiAvailableNotify(env.apiServerURL)),
        }),
    }
}
