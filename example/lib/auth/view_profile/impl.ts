import { initBaseEntryPoint } from "../../example/view_base/impl"
import { ProfileResource, ProfileEntryPoint } from "./entryPoint"

export function initProfileEntryPoint(resource: ProfileResource): ProfileEntryPoint {
    return initBaseEntryPoint(resource, () => {
        resource.logout.terminate()
    })
}
