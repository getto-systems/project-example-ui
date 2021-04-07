import { newClearAuthTicketInfra } from "../clear/impl/init"

import { initLogoutResource } from "./impl"
import { initLogoutCoreAction, initLogoutCoreMaterial } from "./core/impl"

import { LogoutResource } from "./resource"
import { RepositoryOutsideFeature } from "../../../z_vendor/getto-application/infra/repository/infra"
import { RemoteOutsideFeature } from "../../../z_vendor/getto-application/infra/remote/infra"

type OutsideFeature = RemoteOutsideFeature & RepositoryOutsideFeature
export function newLogoutResource(feature: OutsideFeature): LogoutResource {
    return initLogoutResource(
        initLogoutCoreAction(initLogoutCoreMaterial(newClearAuthTicketInfra(feature))),
    )
}
