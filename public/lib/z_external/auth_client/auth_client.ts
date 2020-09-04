import { decodeBase64StringToUint8Array, encodeUint8ArrayToBase64String } from "../../z_external/protocol_buffers_util";

import { ApiCredentialMessage } from "./y_static/auth/credential_pb.js";
import { PasswordLoginMessage } from "./y_static/auth/password_login_pb.js";

export interface AuthClient {
    renew(param: RenewParam): Promise<AuthResponse>;
    passwordLogin(param: PasswordLoginParam): Promise<AuthResponse>;
}

export type RenewParam = Readonly<{ nonce: string }>
export type PasswordLoginParam = Readonly<{ loginID: string, password: string }>

type AuthResponse =
    Readonly<{ success: true, nonce: string, roles: Array<string> }> |
    Readonly<{ success: false, err: AuthError }>
function authSuccess(nonce: string, roles: Array<string>): AuthResponse {
    return { success: true, nonce, roles }
}
function authFailed(err: AuthError): AuthResponse {
    return { success: false, err }
}

type AuthError = Readonly<{ type: string, err: string }>

export function initAuthClient(authServerURL: string): AuthClient {
    return new AuthClientImpl(authServerURL);
}

class AuthClientImpl implements AuthClient {
    authServerURL: string;

    constructor(authServerURL: string) {
        this.authServerURL = authServerURL;
    }

    async renew(params: RenewParam): Promise<AuthResponse> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: requestHeaders("Renew", {
                "X-GETTO-EXAMPLE-ID-TICKET-NONCE": params.nonce,
            }),
        });

        return await parseResponse(response);
    }

    async passwordLogin(params: PasswordLoginParam): Promise<AuthResponse> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: requestHeaders("PasswordLogin", {}),
            body: (() => {
                const f = PasswordLoginMessage;
                const passwordLogin = new f();

                passwordLogin.loginId = params.loginID;
                passwordLogin.password = params.password;

                const arr = f.encode(passwordLogin).finish();
                return encodeUint8ArrayToBase64String(arr);
            })(),
        });

        return await parseResponse(response);
    }
}

function requestHeaders(handler: string, additional_headers: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
        "X-GETTO-EXAMPLE-ID-HANDLER": handler,
    }

    for (const key in additional_headers) {
        headers[key] = additional_headers[key];
    }

    return headers;
}

async function parseResponse(response: Response): Promise<AuthResponse> {
    if (!response.ok) {
        const body = await response.json();
        return authFailed({
            type: typeof body.message === "string" ? body.message : "server-error",
            err: "",
        });
    }

    try {
        const nonce = response.headers.get("X-GETTO-EXAMPLE-ID-TICKET-NONCE");
        const credential = response.headers.get("X-GETTO-EXAMPLE-ID-API-CREDENTIAL");

        if (!nonce) {
            throw "nonce is empty";
        }
        if (!credential) {
            throw "roles is empty";
        }

        const apiCredential = ApiCredentialMessage.decode(decodeBase64StringToUint8Array(credential));

        return authSuccess(nonce, apiCredential.roles ? apiCredential.roles : []);
    } catch (err) {
        return authFailed({ type: "bad-response", err });
    }
}
