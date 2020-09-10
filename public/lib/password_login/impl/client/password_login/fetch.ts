import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../../infra"

import { LoginID } from "../../../../auth_credential/data"
import { Password } from "../../../../password/data"

interface AuthClient {
    passwordLogin(param: { loginID: string, password: string }): Promise<AuthLoginResponse>
}

type AuthLoginResponse =
    Readonly<{ success: true, authCredential: { ticketNonce: string, apiCredential: { apiRoles: Array<string> } } }> |
    Readonly<{ success: false, err: { type: string, err: string } }>

export function initFetchPasswordLoginClient(client: AuthClient): PasswordLoginClient {
    return new FetchPasswordLoginClient(client)
}

class FetchPasswordLoginClient implements PasswordLoginClient {
    client: AuthClient

    constructor(client: AuthClient) {
        this.client = client
    }

    async login(loginID: LoginID, password: Password): Promise<LoginResponse> {
        const response = await this.client.passwordLogin({
            loginID: loginID.loginID,
            password: password.password,
        })

        if (response.success) {
            return loginSuccess({
                ticketNonce: { ticketNonce: response.authCredential.ticketNonce },
                apiCredential: {
                    apiRoles: { apiRoles: response.authCredential.apiCredential.apiRoles },
                },
            })
        }

        switch (response.err.type) {
            case "bad-request":
            case "invalid-password-login":
            case "server-error":
                return loginFailed({ type: response.err.type })

            case "bad-response":
                return loginFailed({ type: "bad-response", err: response.err.err })

            default:
                return loginFailed({ type: "infra-error", err: response.err.err })
        }
    }
}
