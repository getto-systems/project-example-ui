import { NonceValue, ApiRoles } from "../../../credential/data";
import { LoginID, Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initSimulatePasswordLoginClient(targetLoginID: LoginID, targetPassword: Password, nonce: NonceValue, roles: ApiRoles): PasswordLoginClient {
    return {
        login(loginID: LoginID, password: Password): Promise<Credential> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (loginID.loginID !== targetLoginID.loginID || password.password !== targetPassword.password) {
                        resolve(credentialUnauthorized("match-failed"));
                    }

                    resolve(credentialAuthorized(nonce, roles));
                }, 100);
            });
        },
    };
}
