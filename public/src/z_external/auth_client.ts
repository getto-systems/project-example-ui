export interface AuthClient {
    renew(param: RenewParam): Promise<Credential>;
    passwordLogin(param: PasswordLoginParam): Promise<Credential>;
}

export type RenewParam = Readonly<{ nonce: string }>
export type PasswordLoginParam = Readonly<{ loginID: string, password: string }>

type Credential = Readonly<{
    nonce: string,
    roles: Array<string>,
}>

export function initAuthClient(authServerURL: string): AuthClient {
    return new AuthClientImpl(authServerURL);
}

class AuthClientImpl implements AuthClient {
    authServerURL: string;

    constructor(authServerURL: string) {
        this.authServerURL = authServerURL;
    }

    async renew(params: RenewParam): Promise<Credential> {
        const response = await fetch(this.authServerURL, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Getto-Example-ID-Handler": "Renew",
                "X-Getto-Example-ID-TicketNonce": params.nonce,
            },
        });

        return await parseResponse(response);
    }

    async passwordLogin(params: PasswordLoginParam): Promise<Credential> {
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

        return await parseResponse(response);
    }
}

async function parseResponse(response: Response): Promise<Credential> {
    if (!response.ok) {
        const body = await response.json();
        if (typeof body.message === "string") {
            throw body.message;
        } else {
            throw "server-error";
        }
    }

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
