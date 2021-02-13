import { env } from "../../../y_environment/env"

import { initLocationActionPod } from "./impl"

import { LocationActionPod } from "./action"

export function newLocationActionPod(): LocationActionPod {
    return initLocationActionPod({
        config: {
            secureServerHost: env.secureServerHost,
        },
    })
}
