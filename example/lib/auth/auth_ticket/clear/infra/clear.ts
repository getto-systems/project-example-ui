import { env } from "../../../../y_environment/env"

import { newApi_ClearAuthTicket } from "../../../../z_external/api/auth/auth_ticket/clear"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../z_vendor/getto-application/infra/remote/helper"

import { ClearAuthTicketRemotePod } from "../infra"

export function newClearAuthTicketRemote(webCrypto: Crypto): ClearAuthTicketRemotePod {
    return wrapRemote(
        newApi_ClearAuthTicket(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
