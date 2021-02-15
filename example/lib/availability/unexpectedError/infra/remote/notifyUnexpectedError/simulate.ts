import { NotifyUnexpectedErrorRemoteAccess } from "../../../infra"

import { initSimulateRemoteAccess } from "../../../../../z_infra/remote/simulate"

export function initNotifyUnexpectedErrorSimulateRemoteAccess(): NotifyUnexpectedErrorRemoteAccess {
    return initSimulateRemoteAccess(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
