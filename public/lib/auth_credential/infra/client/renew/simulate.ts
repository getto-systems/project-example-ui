import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../../infra";

import { TicketNonce, ApiCredential } from "../../../../auth_credential/data";

export function initSimulateRenewClient(targetTicketNonce: TicketNonce, returnApiCredential: ApiCredential): RenewClient {
    return new SimulateRenewClient(targetTicketNonce, returnApiCredential);
}

class SimulateRenewClient implements RenewClient {
    targetTicketNonce: TicketNonce

    returnApiCredential: ApiCredential

    constructor(targetTicketNonce: TicketNonce, returnApiCredential: ApiCredential) {
        this.targetTicketNonce = targetTicketNonce;
        this.returnApiCredential = returnApiCredential;
    }

    async renew(ticketNonce: TicketNonce): Promise<RenewResponse> {
        if (ticketNonce !== this.targetTicketNonce) {
            return renewFailed({ type: "invalid-ticket" });
        }
        return renewSuccess({
            ticketNonce: this.targetTicketNonce,
            apiCredential: this.returnApiCredential,
        });
    }
}
