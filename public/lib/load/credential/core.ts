import { CredentialAction } from "./action";
import { Renewer, RenewError, Loginer, LoginError, Authorized, authorized, unauthorized } from "./data";
import { Infra, success } from "./infra";

export function credentialAction(infra: Infra): CredentialAction {
    return {
        async renewApiRoles(renewer: Renewer): Promise<Authorized<RenewError>> {
            const nonce = await infra.credentials.findNonce();
            if (nonce.found) {
                const result = await renewer(nonce.value);
                if (result.renew) {
                    const stored = await infra.credentials.storeRoles(result.roles);
                    if (stored === success) {
                        return authorized();
                    }
                    return assertNever(stored)
                }

                return unauthorized(result.err);
            }

            return unauthorized("empty-nonce");
        },
        async login(loginer: Loginer): Promise<Authorized<LoginError>> {
            const result = await loginer();
            if (result.login) {
                const roleStored = await infra.credentials.storeRoles(result.roles);
                if (roleStored !== success) {
                    return assertNever(roleStored);
                }

                const nonceStored = await infra.credentials.storeNonce(result.nonce);
                if (nonceStored !== success) {
                    return assertNever(nonceStored);
                }

                return authorized();
            }

            return unauthorized(result.err);
        },
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
