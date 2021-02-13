import { wait } from "../delayed/core"
import { WaitTime } from "../time/infra"

import { RemoteAccess, RemoteAccessSimulator } from "./infra"

export function initSimulateRemoteAccess<M, V, E>(
    simulator: RemoteAccessSimulator<M, V, E>,
    time: WaitTime
): RemoteAccess<M, V, E> {
    return async (message) => {
        if (time.wait_millisecond > 0) {
            await wait(time, () => null)
        }
        return simulator(message)
    }
}
