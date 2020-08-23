import { NonceValue, ApiRoles, apiRoles } from "../../../credential/data";
import { RenewClient, Credential, credentialUnauthorized, credentialAuthorized } from "../../infra";

export function initFetchRenewClient(authServerURL: string): RenewClient {
    return {
        async renew(nonce: NonceValue): Promise<Credential> {
            const response = await fetch(authServerURL, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-Getto-Example-ID-Handler": "Renew",
                    "X-GETTO-EXAMPLE-ID-TicketNonce": nonce,
                },
            });

            if (response.ok) {
                const roles = response.headers.get("X-GETTO-EXAMPLE-ID-ApiRoles");

                if (nonce && roles) {
                    try {
                        const data = parseCredential(roles);
                        return credentialAuthorized(data.roles);
                    } catch (err) {
                        return credentialUnauthorized("bad-response");
                    }
                }
            }

            const body = await response.json();
            if (body.message) {
                switch (body.message) {
                    case "bad-request":
                    case "invalid-ticket":
                        return credentialUnauthorized(body.message);
                }
            }

            return credentialUnauthorized("server-error");
        },
    }

    type Data = Readonly<{
        roles: ApiRoles,
    }>

    function parseCredential(roles: string): Data {
        return {
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
