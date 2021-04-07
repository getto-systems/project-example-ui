import { env } from "../../../../y_environment/env"

import { newApi_NotifyUnexpectedError } from "../../../../z_external/api/avail/notify_unexpected_error"

import {
    remoteFeature,
    convertRemote,
} from "../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { NotifyUnexpectedErrorRemotePod } from "../../infra"

export function newNotifyUnexpectedErrorRemote(
    feature: RemoteOutsideFeature,
): NotifyUnexpectedErrorRemotePod {
    return convertRemote(newApi_NotifyUnexpectedError(remoteFeature(env.apiServerURL, feature)))
}
