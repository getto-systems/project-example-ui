import { env } from "../../../../../y_environment/env"

import { newApi_RenewAuthTicket } from "../../../../../z_external/api/auth/auth_ticket/renew"

import {
    remoteFeature,
    remoteInfraError,
    wrapRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { RenewAuthTicketRemotePod } from "../../infra"

export function newRenewAuthTicketRemote(webCrypto: Crypto): RenewAuthTicketRemotePod {
    return wrapRemote(
        newApi_RenewAuthTicket(remoteFeature(env.apiServerURL, webCrypto)),
        remoteInfraError,
    )
}
