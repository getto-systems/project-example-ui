import { newAuthzRepository } from "../../../common/authz/infra/repository/authz"
import { newNotifyUnexpectedErrorRemote } from "../infra/remote/notify"

import { initNotifyUnexpectedErrorCoreAction } from "./Core/impl"

import { NotifyUnexpectedErrorResource } from "./resource"
import { initNotifyUnexpectedErrorResource } from "./impl"

type OutsideFeature = Readonly<{
    webStorage: Storage
}>
export function newNotifyUnexpectedErrorResource(
    feature: OutsideFeature,
): NotifyUnexpectedErrorResource {
    const { webStorage } = feature
    return initNotifyUnexpectedErrorResource(
        initNotifyUnexpectedErrorCoreAction({
            authz: newAuthzRepository(webStorage),
            notify: newNotifyUnexpectedErrorRemote(),
        }),
    )
}
