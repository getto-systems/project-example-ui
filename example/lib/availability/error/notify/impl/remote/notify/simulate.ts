import { NotifyRemoteAccess } from "../../../infra"

import { initSimulateRemoteAccess } from "../../../../../../z_infra/remote/simulate"

export function initNotifySimulateRemoteAccess(): NotifyRemoteAccess {
    return initSimulateRemoteAccess(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}