export interface AuthClient {
    renew(param: RenewParam): Promise<RenewResponse>
    passwordLogin(param: PasswordLoginParam): Promise<PasswordLoginResponse>
}

export type RenewParam = Readonly<{ nonce: string }>
export type RenewResponse =
    Readonly<{ success: true, roles: Array<string> }> |
    Readonly<{ success: false, message: string }>

export type PasswordLoginParam = Readonly<{ loginID: string, password: string }>
export type PasswordLoginResponse =
    Readonly<{ success: true, nonce: string, roles: Array<string> }> |
    Readonly<{ success: false, message: string }>

export function initAuthClient(authServerURL: string): AuthClient {
    return new AuthClientImpl(authServerURL);
}

class AuthClientImpl implements AuthClient {
    authServerURL: string;

    constructor(authServerURL: string) {
        this.authServerURL = authServerURL;
    }

    async renew(params: RenewParam): Promise<RenewResponse> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Getto-Example-ID-Handler": "Renew",
                "X-GETTO-EXAMPLE-ID-TicketNonce": params.nonce,
            },
        });

        if (response.ok) {
            const roles = response.headers.get("X-GETTO-EXAMPLE-ID-ApiRoles");

            if (roles) {
                try {
                    const data = parseCredential(roles);
                    return success(data.roles);
                } catch (err) {
                    return failure("bad-response");
                }
            }
        }

        const body = await response.json();
        if (body.message) {
            return failure(body.message);
        } else {
            return failure("server-error");
        }

        //private

        type Data = Readonly<{
            roles: Array<string>,
        }>

        function parseCredential(roles: string): Data {
            return {
                roles: parseApiRoles(JSON.parse(atob(roles))),
            }
        }

        function success(roles: Array<string>): RenewResponse {
            return { success: true, roles: roles }
        }

        function failure(message: string): RenewResponse {
            return { success: false, message: message }
        }
    }

    async passwordLogin(params: PasswordLoginParam): Promise<PasswordLoginResponse> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Getto-Example-ID-Handler": "PasswordLogin",
            },
            body: JSON.stringify({
                login_id: params.loginID,
                password: params.password,
            }),
        });

        if (response.ok) {
            const nonce = response.headers.get("X-GETTO-EXAMPLE-ID-TicketNonce");
            const roles = response.headers.get("X-GETTO-EXAMPLE-ID-ApiRoles");

            if (nonce && roles) {
                try {
                    const data = parseCredential(nonce, roles);
                    return success(data.nonce, data.roles);
                } catch (err) {
                    return failure("bad-response");
                }
            }
        }

        const body = await response.json();
        if (body.message) {
            return failure(body.message);
        } else {
            return failure("server-error");
        }

        //private

        type Data = Readonly<{
            nonce: string,
            roles: Array<string>,
        }>

        function parseCredential(nonce: string, roles: string): Data {
            return {
                nonce: nonce,
                roles: parseApiRoles(JSON.parse(atob(roles))),
            }
        }

        function success(nonce: string, roles: Array<string>): PasswordLoginResponse {
            return { success: true, nonce: nonce, roles: roles }
        }

        function failure(message: string): PasswordLoginResponse {
            return { success: false, message: message }
        }
    }
}

function parseApiRoles(roles: unknown): Array<string> {
    if (!(roles instanceof Array)) {
        throw "parse error";
    }

    const parsedRoles: Array<string> = [];
    roles.forEach((val: unknown) => {
        if (typeof val !== "string") {
            throw "parse error";
        }
        parsedRoles.push(val);
    });

    return parsedRoles;
}
