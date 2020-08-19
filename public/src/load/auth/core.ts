import { Auth, AuthAction, authorized, unauthorized, success } from "./data";
import { Infra } from "./infra";

export function authAction(infra: Infra): AuthAction {
    return {
        async renew(): Promise<Auth> {
            const nonce = await infra.credentials.findNonce();
            if (nonce.found) {
                const credential = await infra.idClient.renew(nonce.value);
                if (credential.authorized) {
                    const result = await infra.credentials.storeRoles(credential.roles);
                    if (result === success) {
                        return authorized;
                    }
                }
            }

            return unauthorized;
        },
    };
}
