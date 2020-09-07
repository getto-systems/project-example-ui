import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../infra";

import { TicketNonce, ApiRoles } from "../../../credential/data";

export function initSimulateRenewClient(targetNonce: TicketNonce, returnRoles: ApiRoles): RenewClient {
    return new SimulateRenewClient(targetNonce, returnRoles);
}

class SimulateRenewClient implements RenewClient {
    targetNonce: TicketNonce

    returnRoles: ApiRoles

    constructor(targetNonce: TicketNonce, returnRoles: ApiRoles) {
        this.targetNonce = targetNonce;
        this.returnRoles = returnRoles;
    }

    async renew(nonce: TicketNonce): Promise<RenewResponse> {
        if (nonce !== this.targetNonce) {
            return renewFailed({ type: "invalid-ticket" });
        }
        return renewSuccess(this.returnRoles);
    }
}
