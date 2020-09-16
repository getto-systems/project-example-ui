import { RenewClient, RenewResponse } from "../../../infra"

import { TicketNonce, ApiCredential } from "../../../../credential/data"

export function initSimulateRenewClient(targetTicketNonce: TicketNonce, returnApiCredential: ApiCredential): RenewClient {
    return new SimulateRenewClient(targetTicketNonce, returnApiCredential)
}

class SimulateRenewClient implements RenewClient {
    targetTicketNonce: TicketNonce

    returnApiCredential: ApiCredential

    constructor(targetTicketNonce: TicketNonce, returnApiCredential: ApiCredential) {
        this.targetTicketNonce = targetTicketNonce
        this.returnApiCredential = returnApiCredential
    }

    async renew(ticketNonce: TicketNonce): Promise<RenewResponse> {
        if (ticketNonce !== this.targetTicketNonce) {
            return { success: true, hasCredential: false }
        }
        return {
            success: true,
            hasCredential: true,
            authCredential: {
                ticketNonce: this.targetTicketNonce,
                apiCredential: this.returnApiCredential,
            },
        }
    }
}
