import { NotFoundEntryPoint, NotFoundResource } from "./entryPoint"

export function initNotFoundEntryPoint(resource: NotFoundResource): NotFoundEntryPoint {
    return {
        resource,
        terminate: () => {
            // 特に terminate するものはない
        }
    }
}
