import { ticker } from "../timer/helper"

import { WaitTime } from "../config/infra"

import { Remote, RemotePod, RemoteSimulator } from "./infra"

export function initRemoteSimulator<M, V, R, E>(
    simulator: RemoteSimulator<M, R, E>,
    time: WaitTime,
): RemotePod<M, V, R, E> {
    return (converter) => async (message) => {
        if (time.wait_millisecond > 0) {
            await ticker(time, () => null)
        }
        const result = simulator(message)
        if (!result.success) {
            return result
        }
        return { success: true, value: converter(result.value) }
    }
}

export function initRemoteSimulator_legacy<M, V, E>(
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
