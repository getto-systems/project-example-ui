import { ticker } from "../timer/helper"

import { WaitTime } from "../config/infra"

import { Remote, RemoteSimulator } from "./infra"

export function initRemoteSimulator<M, V, E>(
    simulator: RemoteSimulator<M, V, E>,
    time: WaitTime,
): Remote<M, V, E> {
    return async (message) => {
        if (time.wait_millisecond > 0) {
            await ticker(time, () => null)
        }
        return simulator(message)
    }
}
