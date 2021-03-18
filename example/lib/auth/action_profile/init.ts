import { newBaseResource } from "../../example/action_base/init"
import { newLogoutResource } from "../auth_ticket/action_logout/init"

import { initProfileView } from "./impl"

import { ProfileView } from "./resource"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newProfileView(feature: OutsideFeature): ProfileView {
    return initProfileView({
        ...newBaseResource(feature),
        ...newLogoutResource(feature),
    })
}
