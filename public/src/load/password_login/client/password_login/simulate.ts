import { NonceValue, ApiRoles } from "../../../credential/data";
import { Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initSimulatePasswordLoginClient(targetPassword: Password, nonce: NonceValue, roles: ApiRoles): PasswordLoginClient {
    return {
        async login(password: Password): Promise<Credential> {
            if (password.loginID !== targetPassword.loginID || password.password !== targetPassword.password) {
                return credentialUnauthorized("match-failed");
            }

            return credentialAuthorized(nonce, roles);
        },
    };
}
