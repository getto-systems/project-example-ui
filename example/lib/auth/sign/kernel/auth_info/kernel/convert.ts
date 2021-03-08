import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import {
    ConvertRepositoryResult,
    RepositoryConverter,
} from "../../../../../z_vendor/getto-application/infra/repository/infra"

import { LastAuthRepositoryValue, AuthRemoteValue } from "./infra"

import { AuthAt, AuthInfo, AuthnNonce, LastAuth } from "./data"
import { RemoteConverter } from "../../../../../z_vendor/getto-application/infra/remote/infra"
import { convertAuthzFromRemote } from "../../../../../common/authz/convert"

export const lastAuthRepositoryConverter: RepositoryConverter<LastAuth, LastAuthRepositoryValue> = {
    toRepository: (info) => ({
        nonce: info.nonce,
        lastAuthAt: info.lastAuthAt.toISOString(),
    }),
    fromRepository: (value: LastAuthRepositoryValue): ConvertRepositoryResult<LastAuth> => {
        const nonce = value.nonce
        const lastAuthAt = new Date(value.lastAuthAt)

        if (!nonce || !lastAuthAt) {
            return { valid: false }
        }

        return {
            valid: true,
            value: {
                nonce: markNonce(nonce),
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
            nonce: markNonce(value.authn.nonce),
            authAt: markAuthAt(clock.now()),
        },
        authz: convertAuthzFromRemote(value.authz),
    }
}

function markNonce(nonce: string): AuthnNonce {
    return nonce as AuthnNonce
}
function markAuthAt(date: Date): AuthAt {
    return date as AuthAt
}