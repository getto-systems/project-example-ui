import { newNotifyUnexpectedErrorRemote } from "../infra/remote/notify"

import { NotifyUnexpectedErrorInfra } from "../infra"
import { RemoteOutsideFeature } from "../../../z_vendor/getto-application/infra/remote/infra"

export function newNotifyUnexpectedErrorInfra(
    feature: RemoteOutsideFeature,
): NotifyUnexpectedErrorInfra {
    return {
        notify: newNotifyUnexpectedErrorRemote(feature),
    }
}
