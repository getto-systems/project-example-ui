import { newNotifyUnexpectedErrorInfra } from "../notify_unexpected_error/impl/init"

import { initNotifyUnexpectedErrorResource } from "./impl"
import { initNotifyUnexpectedErrorCoreAction } from "./core/impl"

import { NotifyUnexpectedErrorResource } from "./resource"

type OutsideFeature = Readonly<{
    webCrypto: Crypto
}>
export function newNotifyUnexpectedErrorResource(
    feature: OutsideFeature,
): NotifyUnexpectedErrorResource {
    const { webCrypto } = feature
    return initNotifyUnexpectedErrorResource(
        initNotifyUnexpectedErrorCoreAction(newNotifyUnexpectedErrorInfra(webCrypto)),
    )
}
