import { ticker } from "../infra/timer/helper"
import { WaitTime } from "../infra/config/infra"

import { Remote, RemoteSimulator } from "./infra"

export function initSimulateRemoteAccess<M, V, E>(
    simulator: RemoteSimulator<M, V, E>,
    time: WaitTime
): Remote<M, V, E> {
    return async (message) => {
        if (time.wait_millisecond > 0) {
            await ticker(time, () => null)
        }
        return simulator(message)
    }
}
