import { AuthCredential, TicketNonce, ApiRoles, ApiRole } from "./data"

export function serializeAuthCredential(authCredential: AuthCredential): AuthCredentialSerialized {
    return {
        ticketNonce: ticketNonceToString(authCredential.ticketNonce),
        apiCredential: {
            apiRoles: authCredential.apiCredential.apiRoles.map((apiRole) => apiRole as unknown as string),
        },
    }
}
export type AuthCredentialSerialized = Readonly<{
    ticketNonce: string,
    apiCredential: {
        apiRoles: Array<string>
    },
}>

export function initTicketNonce(ticketNonce: string): TicketNonce {
    return ticketNonce as _TicketNonce
}

export function ticketNonceToString(ticketNonce: TicketNonce): Readonly<string> {
    return ticketNonce as unknown as string
}

type _TicketNonce = string & TicketNonce

// TODO ApiNonce を追加
//export type _ApiNonce = string & ApiNonce

export function initApiRoles(apiRoles: Array<string>): ApiRoles {
    return apiRoles.map((apiRole) => apiRole as _ApiRole)
}

type _ApiRole = string & ApiRole
