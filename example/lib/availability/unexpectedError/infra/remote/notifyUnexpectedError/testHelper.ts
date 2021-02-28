import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"

import { NotifyUnexpectedErrorRemote } from "../../../infra"

export function initNotifyUnexpectedErrorSimulator(): NotifyUnexpectedErrorRemote {
    return initRemoteSimulator(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}