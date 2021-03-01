import { initRemoteSimulator_legacy } from "../../../../../z_vendor/getto-application/infra/remote/simulate"

import { NotifyUnexpectedErrorRemote } from "../../../infra"

export function initNotifyUnexpectedErrorSimulator(): NotifyUnexpectedErrorRemote {
    return initRemoteSimulator_legacy(() => ({ success: true, value: true }), { wait_millisecond: 0 })
}
