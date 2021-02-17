import { wait } from "../delayed/core"
import { WaitTime } from "../time/infra"

import { Remote, RemoteSimulator } from "./infra"

export function initSimulateRemoteAccess<M, V, E>(
    simulator: RemoteSimulator<M, V, E>,
    time: WaitTime
): Remote<M, V, E> {
    return async (message) => {
        if (time.wait_millisecond > 0) {
            await wait(time, () => null)
        }
        return simulator(message)
    }
}
