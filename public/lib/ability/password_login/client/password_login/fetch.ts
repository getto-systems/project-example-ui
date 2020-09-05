import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../infra";

import { LoginID } from "../../../credential/data";
import { Password } from "../../../password/data";

interface AuthClient {
    passwordLogin(param: { loginID: string, password: string }): Promise<AuthLoginResponse>
}

type AuthLoginResponse =
    Readonly<{ success: true, nonce: string, roles: Array<string> }> |
    Readonly<{ success: false, err: { type: string, err: string } }>

export function initFetchPasswordLoginClient(authClient: AuthClient): PasswordLoginClient {
    return {
        login,
    }

    async function login(loginID: LoginID, password: Password): Promise<LoginResponse> {
        const response = await authClient.passwordLogin({
            loginID: loginID.loginID,
            password: password.password,
        });

        if (response.success) {
            return loginSuccess({ nonce: response.nonce }, { roles: response.roles });
        }

        switch (response.err.type) {
            case "bad-request":
            case "invalid-password-login":
            case "server-error":
                return loginFailed({ type: response.err.type });

            case "bad-response":
                return loginFailed({ type: "bad-response", err: response.err.err });

            default:
                return loginFailed({ type: "infra-error", err: response.err.err });
        }
    }
}
