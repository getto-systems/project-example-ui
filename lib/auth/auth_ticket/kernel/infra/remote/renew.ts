import { env } from "../../../../../y_environment/env"

import { newApi_RenewAuthTicket } from "../../../../../z_details/api/auth/auth_ticket/renew"

import {
    remoteFeature,
    convertRemote,
} from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { RenewAuthTicketRemotePod } from "../../infra"

export function newRenewAuthTicketRemote(feature: RemoteOutsideFeature): RenewAuthTicketRemotePod {
    return convertRemote(newApi_RenewAuthTicket(remoteFeature(env.apiServerURL, feature)))
}
