import { RenewClient, RenewResponse } from "../../../infra"

import { AuthCredential, TicketNonce } from "../../../../credential/data"

export function initSimulateRenewClient(targetTicketNonce: TicketNonce, returnAuthCredential: AuthCredential): RenewClient {
    return new SimulateRenewClient(targetTicketNonce, returnAuthCredential)
}

class SimulateRenewClient implements RenewClient {
    targetTicketNonce: TicketNonce

    returnAuthCredential: AuthCredential

    constructor(targetTicketNonce: TicketNonce, returnAuthCredential: AuthCredential) {
        this.targetTicketNonce = targetTicketNonce
        this.returnAuthCredential = returnAuthCredential
    }

    async renew(ticketNonce: TicketNonce): Promise<RenewResponse> {
        if (ticketNonce !== this.targetTicketNonce) {
            return { success: true, hasCredential: false }
        }
        return {
            success: true,
            hasCredential: true,
            authCredential: this.returnAuthCredential,
        }
    }
}
