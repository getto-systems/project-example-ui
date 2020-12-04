import { AuthCredentialRepository, FindResponse, StoreResponse } from "../../../infra"

import {
    AuthCredential,
    TicketNonce,
    LoginAt,
    ApiCredential,
    markApiCredential,
} from "../../../../../common/credential/data"

export function initMemoryAuthCredentialRepository(
    initialTicketNonce: TicketNonce,
    lastLoginAt: LoginAt
): AuthCredentialRepository {
    return new MemoryAuthCredentialRepository(initialTicketNonce, lastLoginAt)
}

class MemoryAuthCredentialRepository implements AuthCredentialRepository {
    data: {
        ticketNonce: Found<TicketNonce>
        apiCredential: Found<ApiCredential>
        lastLoginAt: Found<LoginAt>
    }

    constructor(initialTicketNonce: TicketNonce, lastLoginAt: LoginAt) {
        this.data = {
            ticketNonce: { found: true, content: initialTicketNonce },
            apiCredential: {
                found: true,
                content: markApiCredential({
                    apiRoles: [],
                }),
            },
            lastLoginAt: { found: true, content: lastLoginAt },
        }
    }

    findTicketNonce(): FindResponse<TicketNonce> {
        return { success: true, ...this.data.ticketNonce }
    }
    findLastLoginAt(): FindResponse<LoginAt> {
        return { success: true, ...this.data.lastLoginAt }
    }
    storeAuthCredential(authCredential: AuthCredential): StoreResponse {
        this.data.ticketNonce = { found: true, content: authCredential.ticketNonce }
        this.data.apiCredential = { found: true, content: authCredential.apiCredential }
        this.data.lastLoginAt = { found: true, content: authCredential.loginAt }
        return { success: true }
    }
    removeAuthCredential(): StoreResponse {
        this.data.ticketNonce = { found: false }
        this.data.apiCredential = { found: false }
        this.data.lastLoginAt = { found: false }
        return { success: true }
    }
}

type Found<T> = Readonly<{ found: false }> | Readonly<{ found: true; content: T }>
