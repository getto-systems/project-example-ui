import { env } from "../../../../y_environment/env"

import { newApi_ClearAuthTicket } from "../../../../z_external/api/auth/auth_ticket/clear"

import {
    remoteInfraError,
    wrapRemote,
} from "../../../../z_vendor/getto-application/infra/remote/helper"

import { ClearAuthTicketRemotePod } from "../infra"

export function newClearAuthTicketRemote(): ClearAuthTicketRemotePod {
    return wrapRemote(newApi_ClearAuthTicket(env.apiServerURL), remoteInfraError)
}
