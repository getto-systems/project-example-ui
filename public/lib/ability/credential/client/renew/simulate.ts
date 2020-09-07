import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../infra";

import { Nonce, ApiRoles } from "../../../credential/data";

export function initSimulateRenewClient(targetNonce: Nonce, returnRoles: ApiRoles): RenewClient {
    return new SimulateRenewClient(targetNonce, returnRoles);
}

class SimulateRenewClient implements RenewClient {
    targetNonce: Nonce

    returnRoles: ApiRoles

    constructor(targetNonce: Nonce, returnRoles: ApiRoles) {
        this.targetNonce = targetNonce;
        this.returnRoles = returnRoles;
    }

    async renew(nonce: Nonce): Promise<RenewResponse> {
        if (nonce !== this.targetNonce) {
            return renewFailed({ type: "invalid-ticket" });
        }
        return renewSuccess(this.returnRoles);
    }
}
