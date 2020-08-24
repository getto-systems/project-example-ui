import { NonceValue, ApiRoles } from "../../../credential/data";
import { LoginID, Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initFetchPasswordLoginClient(authServerURL: string): PasswordLoginClient {
    return {
        async login(loginID: LoginID, password: Password): Promise<Credential> {
            const response = await fetch(authServerURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-Getto-Example-ID-Handler": "PasswordLogin",
                },
                body: JSON.stringify({
                    login_id: loginID.loginID,
                    password: password.password,
                }),
            });

            if (response.ok) {
                const nonce = response.headers.get("X-GETTO-EXAMPLE-ID-TicketNonce");
                const roles = response.headers.get("X-GETTO-EXAMPLE-ID-ApiRoles");

                if (nonce && roles) {
                    try {
                        const data = parseCredential(nonce, roles);
                        return credentialAuthorized(data.nonce, data.roles);
                    } catch (err) {
                        return credentialUnauthorized("bad-response");
                    }
                }
            }

            const body = await response.json();
            switch (body.message) {
                case "bad-request":
                case "invalid-password-login":
                    return credentialUnauthorized(body.message);
            }

            return credentialUnauthorized("server-error");
        },
    }

    type Data = Readonly<{
        nonce: NonceValue,
        roles: ApiRoles,
    }>

    function parseCredential(nonce: string, roles: string): Data {
        return {
            nonce: nonce,
            roles: parseApiRoles(JSON.parse(atob(roles))),
        }
    }
}

function parseApiRoles(roles: unknown): ApiRoles {
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
