import { RepositoryConverter } from "../../../../../z_vendor/getto-application/infra/repository/infra"

import { AuthzRemoteValue, AuthzRepositoryValue } from "./infra"
import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import { RemoteConverter } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { AuthRemoteValue, LastAuthRepositoryValue } from "./infra"

import { Authz, AuthzNonce, AuthzRoles } from "./data"
import { AuthAt, AuthInfo, AuthnNonce, LastAuth } from "./data"

export const lastAuthRepositoryConverter: RepositoryConverter<LastAuth, LastAuthRepositoryValue> = {
    toRepository: (value) => ({
        nonce: value.nonce,
        lastAuthAt: value.lastAuthAt.toISOString(),
    }),
    fromRepository: (value) => {
        const nonce = value.nonce
        const lastAuthAt = new Date(value.lastAuthAt)

        if (!nonce || !lastAuthAt) {
            return { valid: false }
        }

        return {
            valid: true,
            value: {
                nonce: markAuthnNonce(nonce),
                lastAuthAt: markAuthAt(lastAuthAt),
            },
        }
    },
}

interface AuthConverter {
    (clock: Clock): RemoteConverter<AuthInfo, AuthRemoteValue>
}
export const authRemoteConverter: AuthConverter = (clock) => (value) => {
    // remote からの値はバリデーションせずに受け取る
    return {
        authn: {
            nonce: markAuthnNonce(value.authn.nonce),
            authAt: markAuthAt(clock.now()),
        },
        authz: authzRemoteConverter(value.authz),
    }
}

export const authzRepositoryConverter: RepositoryConverter<Authz, AuthzRepositoryValue> = {
    toRepository: (value) => value,
    fromRepository: (value) => {
        const nonce = value.nonce
        const roles = value.roles

        if (!nonce) {
            return { valid: false }
        }

        // roles のバリデーションは特にしない

        return {
            valid: true,
            found: true,
            value: {
                nonce: markAuthzNonce(nonce),
                roles: markAuthzRoles(roles),
            },
        }
    },
}

export function authzRemoteConverter(value: AuthzRemoteValue): Authz {
    return {
        nonce: markAuthzNonce(value.nonce),
        roles: markAuthzRoles(value.roles),
    }
}

function markAuthnNonce(nonce: string): AuthnNonce {
    return nonce as AuthnNonce
}
function markAuthAt(date: Date): AuthAt {
    return date as AuthAt
}

function markAuthzNonce(nonce: string): AuthzNonce {
    return nonce as AuthzNonce
}
function markAuthzRoles(roles: string[]): AuthzRoles {
    return roles as AuthzRoles
}
