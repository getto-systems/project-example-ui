import { RenewAction } from "./action";
import { NonceValue, Renew, renewSuccess, renewFailed } from "../credential/data";
import { Infra } from "./infra";

export function renewAction(infra: Infra): RenewAction {
    return async (nonce: NonceValue): Promise<Renew> => {
        const credential = await infra.renewClient.renew(nonce);
        if (credential.authorized) {
            return renewSuccess(credential.roles);
        }

        return renewFailed(credential.err);
    }
}
