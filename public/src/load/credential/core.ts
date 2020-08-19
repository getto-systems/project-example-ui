import { CredentialAction } from "./action";
import { Renewer, Authorized, authorized, unauthorized } from "./data";
import { Infra, success } from "./infra";

export function credentialAction(infra: Infra): CredentialAction {
    return {
        async renewApiRoles(renewer: Renewer): Promise<Authorized> {
            const nonce = await infra.credentials.findNonce();
            if (nonce.found) {
                const result = await renewer(nonce.value);
                if (result.renewed) {
                    const stored = await infra.credentials.storeRoles(result.roles);
                    if (stored === success) {
                        return authorized;
                    }
                }
            }

            return unauthorized;
        },
    }
}
