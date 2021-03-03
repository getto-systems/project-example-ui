import { RepositoryConverter } from "../../z_vendor/getto-application/infra/repository/infra"
import { AuthzRemoteValue, AuthzRepositoryValue } from "./infra"

import { Authz, AuthzNonce, AuthzRoles } from "./data"

export const authzRepositoryConverter: RepositoryConverter<Authz, AuthzRepositoryValue> = {
    toRepository: (value) => value,
    fromRepository: (value) => {
        const nonce = value.nonce
        const roles = value.roles

        console.log("AUTHZ REPOSITORY VALUE", value)

        if (!nonce) {
            return { success: false }
        }

        // roles のバリデーションは特にしない

        return {
            success: true,
            found: true,
            value: {
                nonce: markNonce(nonce),
                roles: markRoles(roles),
            },
        }
    },
}

export function convertAuthzFromRemote(value: AuthzRemoteValue): Authz {
    return {
        nonce: markNonce(value.nonce),
        roles: markRoles(value.roles),
    }
}

function markNonce(nonce: string): AuthzNonce {
    return nonce as AuthzNonce
}
function markRoles(roles: string[]): AuthzRoles {
    return roles as AuthzRoles
}
