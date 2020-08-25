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
                "X-Getto-Example-ID-TicketNonce": params.nonce,
            },
        });

        try {
            return success(await parseCredential(response));
        } catch (err) {
            return failure(err);
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

        try {
            return success(await parseCredential(response));
        } catch (err) {
            return failure(err);
        }
    }
}

type Data = Readonly<{
    nonce: string,
    roles: Array<string>,
}>

async function parseCredential(response: Response): Promise<Data> {
    if (response.ok) {
        try {
            const nonce = response.headers.get("X-GETTO-EXAMPLE-ID-TicketNonce");
            const roles = response.headers.get("X-GETTO-EXAMPLE-ID-ApiRoles");

            if (!nonce) {
                throw "nonce is empty";
            }
            if (!roles) {
                throw "roles is empty";
            }

            return {
                nonce: nonce,
                roles: parseApiRoles(JSON.parse(atob(roles))),
            }
        } catch (err) {
            // TODO ここでエラーを握りつぶさない方法を考えたい
            throw "bad-response";
        }
    } else {
        const body = await response.json();
        if (typeof body.message === "string") {
            throw body.message;
        } else {
            throw "server-error";
        }
    }
}

function success(data: Data): PasswordLoginResponse {
    return { success: true, nonce: data.nonce, roles: data.roles }
}

function failure(message: string): PasswordLoginResponse {
    return { success: false, message: message }
}

function parseApiRoles(roles: unknown): Array<string> {
    if (!(roles instanceof Array)) {
        throw "parse error: roles is not array";
    }

    const parsedRoles: Array<string> = [];
    roles.forEach((val: unknown) => {
        if (typeof val !== "string") {
            throw "parse error: role element is not array";
        }
        parsedRoles.push(val);
    });

    return parsedRoles;
}
