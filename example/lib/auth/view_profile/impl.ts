import { ProfileResource, ProfileEntryPoint } from "./entryPoint"

export function initProfileEntryPoint(resource: ProfileResource): ProfileEntryPoint {
    return {
        resource,
        terminate: () => {
            resource.menu.terminate()

            resource.logout.terminate()
        },
    }
}
