import { LoginID, Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";
import { AuthClient } from "../../../../z_external/auth_client";

export function initFetchPasswordLoginClient(authClient: AuthClient): PasswordLoginClient {
    return {
        async login(loginID: LoginID, password: Password): Promise<Credential> {
            const response = await authClient.passwordLogin({
                loginID: loginID.loginID,
                password: password.password,
            });

            if (response.success) {
                return credentialAuthorized(response.nonce, response.roles);
            } else {
                switch (response.message) {
                    case "bad-request":
                    case "bad-response":
                    case "invalid-password-login":
                        return credentialUnauthorized(response.message);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
    }
}
