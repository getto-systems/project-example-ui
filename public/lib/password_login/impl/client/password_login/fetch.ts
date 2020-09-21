import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../../infra"

import { initTicketNonce } from "../../../../credential/data"
import { LoginID, loginIDToString } from "../../../../login_id/data"
import { Password, passwordToString } from "../../../../password/data"

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
            loginID: loginIDToString(loginID),
            password: passwordToString(password),
        })

        if (response.success) {
            return loginSuccess({
                ticketNonce: initTicketNonce(response.authCredential.ticketNonce),
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
