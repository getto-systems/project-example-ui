import { NotFoundEntryPoint, NotFoundResource } from "./entry_point"

export function initNotFoundEntryPoint(resource: NotFoundResource): NotFoundEntryPoint {
    return {
        resource,
        terminate: () => {
            // 特に terminate するものはない
        }
    }
}
