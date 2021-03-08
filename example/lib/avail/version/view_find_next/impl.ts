import { FindNextVersionEntryPoint, FindNextVersionResource } from "./entry_point"

export function initFindNextVersionEntryPoint(
    resource: FindNextVersionResource,
): FindNextVersionEntryPoint {
    return {
        resource,
        terminate: () => {
            resource.findNext.terminate()
        },
    }
}
