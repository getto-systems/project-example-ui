import { env } from "../../../../y_environment/env"

import { newApi_ClearAuthTicket } from "../../../../z_details/api/auth/auth_ticket/clear"

import {
    remoteFeature,
    convertRemote,
} from "../../../../z_vendor/getto-application/infra/remote/helper"

import { RemoteOutsideFeature } from "../../../../z_vendor/getto-application/infra/remote/infra"
import { ClearAuthTicketRemotePod } from "../infra"

export function newClearAuthTicketRemote(feature: RemoteOutsideFeature): ClearAuthTicketRemotePod {
    return convertRemote(newApi_ClearAuthTicket(remoteFeature(env.apiServerURL, feature)))
}
