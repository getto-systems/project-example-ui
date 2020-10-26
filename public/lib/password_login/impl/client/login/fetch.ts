import { PasswordLoginClient, LoginResponse, loginSuccess, loginFailed } from "../../../infra"

import { packTicketNonce, packApiRoles, packAuthAt } from "../../../../credential/adapter"
import { unpackLoginID } from "../../../../login_id/adapter"
import { unpackPassword } from "../../../../password/adapter"

import { LoginFields } from "../../../data"

interface AuthClient {
    passwordLogin(param: { loginID: string; password: string }): Promise<AuthLoginResponse>
}

type AuthLoginResponse =
    | Readonly<{
          success: true
          authCredential: { ticketNonce: string; apiCredential: { apiRoles: string[] } }
      }>
    | Readonly<{ success: false; err: { type: string; err: string } }>

export function initFetchPasswordLoginClient(client: AuthClient): PasswordLoginClient {
    return new FetchPasswordLoginClient(client)
}

class FetchPasswordLoginClient implements PasswordLoginClient {
    client: AuthClient

    constructor(client: AuthClient) {
        this.client = client
    }

    async login({ loginID, password }: LoginFields): Promise<LoginResponse> {
        try {
            const response = await this.client.passwordLogin({
                loginID: unpackLoginID(loginID),
                password: unpackPassword(password),
            })

            if (response.success) {
                return loginSuccess({
                    ticketNonce: packTicketNonce(response.authCredential.ticketNonce),
                    apiCredential: {
                        apiRoles: packApiRoles(response.authCredential.apiCredential.apiRoles),
                    },
                    authAt: packAuthAt(new Date()),
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
        } catch (err) {
            return loginFailed({ type: "infra-error", err: `${err}` })
        }
    }
}
