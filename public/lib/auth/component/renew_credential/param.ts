import { RenewCredentialParam } from "./component"

import { TicketNonce } from "../../../credential/data"

export function packRenewCredentialParam(ticketNonce: TicketNonce): RenewCredentialParam {
    return { ticketNonce } as RenewCredentialParam & Param
}

export function unpackRenewCredentialParam(param: RenewCredentialParam): Param {
    return param as unknown as Param
}

type Param = {
    ticketNonce: TicketNonce
}
