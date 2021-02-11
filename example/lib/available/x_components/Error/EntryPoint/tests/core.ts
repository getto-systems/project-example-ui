import { initNotifySimulateRemoteAccess } from "../../../../notify/impl/remote/notify/simulate"

import { notify } from "../../../../notify/impl/core"

import { NotifyAction } from "../../../../notify/action"

export function initTestNotifyAction(): NotifyAction {
    return {
        notify: notify({
            notify: initNotifySimulateRemoteAccess(),
        }),
    }
}
