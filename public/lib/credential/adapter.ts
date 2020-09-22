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
        apiRoles: string[]
    },
}>

export function initTicketNonce(ticketNonce: string): TicketNonce {
    return ticketNonce as string & TicketNonce
}

export function ticketNonceToString(ticketNonce: TicketNonce): string {
    return ticketNonce as unknown as string
}

// TODO ApiNonce を追加
//export type _ApiNonce = string & ApiNonce

export function initApiRoles(apiRoles: string[]): ApiRoles {
    return apiRoles.map((apiRole) => apiRole as string & ApiRole)
}
