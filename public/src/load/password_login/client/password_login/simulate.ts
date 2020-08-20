import { NonceValue, ApiRoles } from "../../../credential/data";
import { LoginID, Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initSimulatePasswordLoginClient(targetLoginID: LoginID, targetPassword: Password, nonce: NonceValue, roles: ApiRoles): PasswordLoginClient {
    return {
        async login(loginID: LoginID, password: Password): Promise<Credential> {
            if (loginID.loginID !== targetLoginID.loginID || password.password !== targetPassword.password) {
                return credentialUnauthorized("match-failed");
            }

            return credentialAuthorized(nonce, roles);
        },
    };
}
