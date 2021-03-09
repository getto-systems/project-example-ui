import { DocsContentEntryPoint, DocsContentResource } from "./entry_point"

export function initDocsContentEntryPoint(resource: DocsContentResource): DocsContentEntryPoint {
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()
        },
    }
}
