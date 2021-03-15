import { newBaseResource } from "../../example/action_base/init"
import { newLogoutResource } from "../sign/auth_ticket/action_logout/init"

import { initProfileEntryPoint } from "./impl"

import { ProfileEntryPoint } from "./entry_point"

type OutsideFeature = Readonly<{
    webStorage: Storage
    currentLocation: Location
}>
export function newProfileEntryPoint(feature: OutsideFeature): ProfileEntryPoint {
    return initProfileEntryPoint({
        ...newBaseResource(feature),
        ...newLogoutResource(feature),
    })
}
