import { LoginID, Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

interface passwordLoginClient {
    passwordLogin(param: { loginID: string, password: string }): Promise<{ nonce: string, roles: Array<string> }>
}

export function initFetchPasswordLoginClient(authClient: passwordLoginClient): PasswordLoginClient {
    return {
        async login(loginID: LoginID, password: Password): Promise<Credential> {
            try {
                const response = await authClient.passwordLogin({
                    loginID: loginID.loginID,
                    password: password.password,
                });

                return credentialAuthorized(response.nonce, response.roles);
            } catch (err) {
                switch (err) {
                    case "bad-response":
                    case "bad-request":
                    case "invalid-password-login":
                        return credentialUnauthorized(err);
                    default:
                        return credentialUnauthorized("server-error");
                }
            }
        },
    }
}
