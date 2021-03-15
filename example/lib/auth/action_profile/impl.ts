import { initBaseView } from "../../example/action_base/impl"
import { ProfileResource, ProfileView } from "./resource"

export function initProfileView(resource: ProfileResource): ProfileView {
    return initBaseView(resource, () => {
        resource.logout.terminate()
    })
}
