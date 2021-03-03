import { initRemoteSimulator } from "../../../../../z_vendor/getto-application/infra/remote/simulate"

import { NotifyUnexpectedErrorRemotePod } from "../../../infra"

export function initNotifyUnexpectedErrorSimulator(): NotifyUnexpectedErrorRemotePod {
    return initRemoteSimulator(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
