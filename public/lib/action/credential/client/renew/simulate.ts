import { NonceValue, ApiRoles } from "../../../credential/data";
import { RenewClient, RenewResponse, renewSuccess, renewFailed } from "../../infra";

export function initSimulateRenewClient(targetNonce: NonceValue, roles: ApiRoles): RenewClient {
    return {
        renew,
    }

    async function renew(nonce: NonceValue): Promise<RenewResponse> {
        if (nonce !== targetNonce) {
            return renewFailed({ type: "invalid-ticket" });
        }
        return renewSuccess(roles);
    }
}
