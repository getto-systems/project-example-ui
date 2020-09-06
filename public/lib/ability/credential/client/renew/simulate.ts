import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../infra";

import { NonceValue, ApiRoles } from "../../../credential/data";

export function initSimulateRenewClient(targetNonce: NonceValue, returnRoles: ApiRoles): RenewClient {
    return new SimulateRenewClient(targetNonce, returnRoles);
}

class SimulateRenewClient implements RenewClient {
    targetNonce: NonceValue

    returnRoles: ApiRoles

    constructor(targetNonce: NonceValue, returnRoles: ApiRoles) {
        this.targetNonce = targetNonce;
        this.returnRoles = returnRoles;
    }

    async renew(nonce: NonceValue): Promise<RenewResponse> {
        if (nonce !== this.targetNonce) {
            return renewFailed({ type: "invalid-ticket" });
        }
        return renewSuccess(this.returnRoles);
    }
}
