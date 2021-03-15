import { initBaseEntryPoint } from "../../example/action_base/impl"
import { ProfileResource, ProfileEntryPoint } from "./entry_point"

export function initProfileEntryPoint(resource: ProfileResource): ProfileEntryPoint {
    return initBaseEntryPoint(resource, () => {
        resource.logout.terminate()
    })
}
