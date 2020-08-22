import { NonceValue, ApiRoles, apiRoles } from "../../../credential/data";
import { LoginID, Password } from "../../data";
import { PasswordLoginClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initFetchPasswordLoginClient(authServerURL: string): PasswordLoginClient {
    return {
        async login(loginID: LoginID, password: Password): Promise<Credential> {
            const response = await fetch(authServerURL, {
                method: "POST",
                mode: "cors",
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
            if (body.message) {
                switch (body.message) {
                    case "bad-request":
                    case "invalid-password-login":
                        return credentialUnauthorized(body.message);
                }
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
            roles: parseApiRoles(roles),
        }
    }
    function parseApiRoles(roles: string): ApiRoles {
        const rawRoles = JSON.parse(atob(roles));
        if (rawRoles instanceof Array) {
            const parsedRoles: Array<string> = [];
            parsedRoles.forEach((val) => {
                if (typeof val !== "string") {
                    throw "parse error";
                }
                parsedRoles.push(val);
            });

            return apiRoles(parsedRoles);
        }

        throw "parse error";
    }
}
