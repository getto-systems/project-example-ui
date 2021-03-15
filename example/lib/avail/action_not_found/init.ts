import { newGetCurrentVersionResource } from "../version/action_get_current/init"

import { initNotFoundEntryPoint } from "./impl"

import { NotFoundEntryPoint } from "./entry_point"

export function newNotFoundEntryPoint(): NotFoundEntryPoint {
    return initNotFoundEntryPoint({
        ...newGetCurrentVersionResource(),
    })
}
