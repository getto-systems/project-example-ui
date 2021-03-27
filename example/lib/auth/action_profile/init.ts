import { BaseOutsideFeature, newBaseResource } from "../../example/action_base/init"
import { newLogoutResource } from "../auth_ticket/action_logout/init"

import { initProfileView } from "./impl"

import { ProfileView } from "./resource"

export function newProfileView(feature: BaseOutsideFeature): ProfileView {
    return initProfileView({
        ...newBaseResource(feature),
        ...newLogoutResource(feature),
    })
}
