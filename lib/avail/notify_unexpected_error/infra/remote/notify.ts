import { env } from "../../../../y_environment/env"

import { newApi_NotifyUnexpectedError } from "../../../../z_external/api/avail/notify_unexpected_error"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../z_vendor/getto-application/infra/remote/helper"

import { NotifyUnexpectedErrorRemotePod } from "../../infra"

export function newNotifyUnexpectedErrorRemote(webCrypto: Crypto): NotifyUnexpectedErrorRemotePod {
    return wrapRemote(
        newApi_NotifyUnexpectedError(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
