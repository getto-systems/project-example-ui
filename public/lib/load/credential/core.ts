import { CredentialAction } from "./action";
import {
    LoginID,
    LoginIDValidationError,
    NonceValue,
    ApiRoles,
    StoreState,
    loginSuccess,
    loginFailure,
    RenewState,
    renewSuccess,
    renewFailure,
} from "./data";
import { Infra } from "./infra";

export function credentialAction(infra: Infra): CredentialAction {
    return {
        validateLoginID,

        store,
        renew,
    }

    function validateLoginID(loginID: LoginID): Array<LoginIDValidationError> {
        const errors: Array<LoginIDValidationError> = [];

        if (loginID.loginID.length === 0) {
            errors.push("empty");
        }

        return errors;
    }

    async function renew(): Promise<RenewState> {
        try {
            const nonce = await infra.credentials.findNonce();
            if (nonce.found) {
                const response = await infra.renewClient.renew(nonce.value);
                if (response.success) {
                    await infra.credentials.storeRoles(response.roles);
                    return renewSuccess;
                }

                return renewFailure(response.err);
            }

            return renewFailure({ type: "empty-nonce" });
        } catch (err) {
            return renewFailure({ type: "infra-error", err });
        }
    }

    async function store(nonce: NonceValue, roles: ApiRoles): Promise<StoreState> {
        try {
            await Promise.all([
                infra.credentials.storeNonce(nonce),
                infra.credentials.storeRoles(roles),
            ]);
            return loginSuccess;
        } catch (err) {
            return loginFailure({ type: "infra-error", err });
        }
    }
}
