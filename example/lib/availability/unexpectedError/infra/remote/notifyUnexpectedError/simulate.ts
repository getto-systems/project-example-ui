import { NotifyUnexpectedErrorRemoteAccess } from "../../../infra"

import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"

export function initNotifyUnexpectedErrorSimulateRemoteAccess(): NotifyUnexpectedErrorRemoteAccess {
    return initRemoteSimulator(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
