import { FindNextVersionEntryPoint, FindNextVersionResource } from "./entryPoint"

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
