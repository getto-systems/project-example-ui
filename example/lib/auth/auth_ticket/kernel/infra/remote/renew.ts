import { env } from "../../../../../y_environment/env"

import { newApi_RenewAuthTicket } from "../../../../../z_external/api/auth/sign/auth_ticket/renew"

import { wrapRemote } from "../../../../../z_vendor/getto-application/infra/remote/helper"

import { RenewAuthTicketRemotePod } from "../../infra"

export function newRenewAuthTicketRemote(): RenewAuthTicketRemotePod {
    return wrapRemote(newApi_RenewAuthTicket(env.apiServerURL), (err) => ({
        type: "infra-error",
        err: `${err}`,
    }))
}
