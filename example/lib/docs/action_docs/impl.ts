import { DocsEntryPoint, DocsResource } from "./entry_point"

export function initDocsEntryPoint(resource: DocsResource): DocsEntryPoint {
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
        },
    }
}
