import { Clock } from "../../../../../z_vendor/getto-application/infra/clock/infra"
import {
    ConvertRepositoryResult,
    RepositoryConverter,
} from "../../../../../z_vendor/getto-application/infra/repository/infra"

import { LastAuthRepositoryValue, RenewRemoteValue, RenewResponse } from "./infra"

import { AuthAt, AuthnNonce, LastAuth } from "./data"
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
            return { success: false }
        }

        return {
            success: true,
            value: {
                nonce: markNonce(nonce),
                lastAuthAt: markAuthAt(lastAuthAt),
            },
        }
    },
}

interface RenewConverter {
    (clock: Clock): RemoteConverter<RenewResponse, RenewRemoteValue>
}
export const renewRemoteConverter: RenewConverter = (clock) => (value) => {
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
