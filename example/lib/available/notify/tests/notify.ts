import { initNotifySimulateRemoteAccess } from "../impl/remote/notify/simulate"

import { notify } from "../impl/core"

import { NotifyAction } from "../action"

export function initTestNotifyAction(): NotifyAction {
    return {
        notify: notify({
            notify: initNotifySimulateRemoteAccess(),
        }),
    }
}
