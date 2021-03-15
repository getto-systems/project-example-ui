import { newAuthzRepository } from "../../auth/sign/auth_ticket/kernel/infra/repository/authz"
import { newNotifyUnexpectedErrorRemote } from "../notify_unexpected_error/infra/remote/notify"

import { initNotifyUnexpectedErrorCoreAction } from "./core/impl"

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