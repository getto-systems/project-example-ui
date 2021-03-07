import { newAuthzRepository } from "../../../common/authz/infra/repository/authz"
import { newNotifyUnexpectedErrorRemote } from "../infra/remote/notify"

import { initNotifyUnexpectedErrorCoreAction } from "./Core/impl"

import { NotifyUnexpectedErrorResource } from "./resource"
import { initNotifyUnexpectedErrorResource } from "./impl"

export function newNotifyUnexpectedErrorResource(
    webStorage: Storage,
): NotifyUnexpectedErrorResource {
    return initNotifyUnexpectedErrorResource(
        initNotifyUnexpectedErrorCoreAction({
            authz: newAuthzRepository(webStorage),
            notify: newNotifyUnexpectedErrorRemote(),
        }),
    )
}
