import { BaseEntryPoint, BaseResource } from "./entry_point"

export function initBaseEntryPoint<R>(
    resource: R & BaseResource,
    terminate: { (): void },
): BaseEntryPoint<R> {
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
            terminate()
        },
    }
}
