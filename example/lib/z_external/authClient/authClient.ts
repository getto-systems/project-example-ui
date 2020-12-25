import { ApiCredentialMessage } from "./y_static/auth/credential_pb.js"
import { PasswordLoginMessage } from "./y_static/auth/password_login_pb.js"

import {
    decodeBase64StringToUint8Array,
    encodeUint8ArrayToBase64String,
} from "../protobufUtil"

export interface AuthClient {
    renew(param: RenewParam): Promise<AuthResponse>
    passwordLogin(param: PasswordLoginParam): Promise<AuthResponse>
}

export type RenewParam = Readonly<{ nonce: string }>
export type PasswordLoginParam = Readonly<{ loginID: string; password: string }>

type AuthResponse =
    | Readonly<{
          success: true
          authCredential: { ticketNonce: string; apiCredential: { apiRoles: string[] } }
      }>
    | Readonly<{ success: false; err: AuthError }>
function authSuccess(ticketNonce: string, apiRoles: string[]): AuthResponse {
    return { success: true, authCredential: { ticketNonce, apiCredential: { apiRoles } } }
}
function authFailed(err: AuthError): AuthResponse {
    return { success: false, err }
}

type AuthError = Readonly<{ type: string; err: string }>

export function initAuthClient(authServerURL: string): AuthClient {
    return new Client(authServerURL)
}

class Client implements AuthClient {
    authServerURL: string

    constructor(authServerURL: string) {
        this.authServerURL = authServerURL
    }

    renew(params: RenewParam): Promise<AuthResponse> {
        return this.authRequest("Renew", {
            header: [["X-GETTO-EXAMPLE-ID-TICKET-NONCE", params.nonce]],
            body: noBody,
            response: parseAuthResponse,
        })
    }

    async passwordLogin(params: PasswordLoginParam): Promise<AuthResponse> {
        return this.authRequest("PasswordLogin", {
            header: [],
            body: hasBody(() => {
                const f = PasswordLoginMessage
                const passwordLogin = new f()

                passwordLogin.loginId = params.loginID
                passwordLogin.password = params.password

                const arr = f.encode(passwordLogin).finish()
                return encodeUint8ArrayToBase64String(arr)
            }),
            response: parseAuthResponse,
        })
    }

    authRequest(handler: string, authRequest: AuthRequest): Promise<AuthResponse> {
        return new Promise((resolve, reject) => {
            try {
                const request = new XMLHttpRequest()

                request.addEventListener("load", () => {
                    // TODO start session とかだとここが変わるはずなんだよね
                    resolve(authRequest.response(request))
                })
                request.addEventListener("error", () => {
                    resolve(errorResponse(request))
                })

                request.withCredentials = true

                request.open("POST", this.authServerURL)

                authRequest.header
                    .concat([["X-GETTO-EXAMPLE-ID-HANDLER", handler]])
                    .forEach((header) => {
                        request.setRequestHeader(...header)
                    })

                request.send(bodyString(authRequest.body))
            } catch (err) {
                reject(err)
            }
        })
    }
}

type AuthRequest = Readonly<{
    header: [string, string][]
    body: AuthRequestBody
    response: AuthResponseHandler
}>

type AuthRequestBody = Readonly<{ hasBody: false }> | Readonly<{ hasBody: true; body: string }>
const noBody: AuthRequestBody = { hasBody: false }
function hasBody(producer: AuthRequestBodyProducer): AuthRequestBody {
    return { hasBody: true, body: producer() }
}
function bodyString(body: AuthRequestBody): string | null {
    if (!body.hasBody) {
        return null
    }
    return body.body
}

interface AuthRequestBodyProducer {
    (): string
}

interface AuthResponseHandler {
    (request: XMLHttpRequest): AuthResponse
}

function parseAuthResponse(request: XMLHttpRequest): AuthResponse {
    if (request.status !== 200) {
        return errorResponse(request)
    }

    try {
        const nonce = request.getResponseHeader("X-GETTO-EXAMPLE-ID-TICKET-NONCE")
        const credential = request.getResponseHeader("X-GETTO-EXAMPLE-ID-API-CREDENTIAL")

        if (!nonce) {
            throw "nonce is empty"
        }
        if (!credential) {
            throw "roles is empty"
        }

        const apiCredential = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(credential))

        return authSuccess(nonce, apiCredential.roles ? apiCredential.roles : [])
    } catch (err) {
        return authFailed({ type: "bad-response", err: `${err}` })
    }
}

function errorResponse(request: XMLHttpRequest): AuthResponse {
    try {
        const response = JSON.parse(request.responseText)
        return authFailed({ type: response.message || "server-error", err: "" })
    } catch (err) {
        return authFailed({ type: "server-error", err: `${err}` })
    }
}
