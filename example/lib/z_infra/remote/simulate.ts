import { wait } from "../delayed/core"
import { WaitTime } from "../time/infra"

import { RemoteAccess, RemoteAccessResult } from "./infra"

export interface RemoteAccessSimulator<M, V, E> {
    (message: M): RemoteAccessResult<V, E>
}

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
