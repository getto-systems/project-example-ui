import { newGetCurrentVersionResource } from "../version/getCurrent/Action/init"

import { initNotFoundEntryPoint } from "./impl"

import { NotFoundEntryPoint } from "./entryPoint"

export function newNotFoundEntryPoint(): NotFoundEntryPoint {
    return initNotFoundEntryPoint({
        ...newGetCurrentVersionResource(),
    })
}
