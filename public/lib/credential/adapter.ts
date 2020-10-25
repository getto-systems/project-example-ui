import { ApiCredential, TicketNonce, ApiRoles, ApiRole, AuthAt } from "./data"

export function packTicketNonce(ticketNonce: string): TicketNonce {
    return ticketNonce as TicketNonce & string
}

export function unpackTicketNonce(ticketNonce: TicketNonce): string {
    return (ticketNonce as unknown) as string
}

// TODO ApiNonce を追加
//export type _ApiNonce = string & ApiNonce

export function packApiRoles(apiRoles: string[]): ApiRoles {
    return apiRoles.map((apiRole) => apiRole as ApiRole & string)
}

export function unpackApiCredential(apiCredential: ApiCredential): ApiCredentialUnpack {
    return {
        apiRoles: apiCredential.apiRoles.map((apiRole) => (apiRole as unknown) as string),
    }
}
export type ApiCredentialUnpack = Readonly<{
    apiRoles: string[]
}>

export function packAuthAt(authAt: Date): AuthAt {
    return authAt as AuthAt & Date
}

export function unpackAuthAt(authAt: AuthAt): Date {
    return (authAt as unknown) as Date
}
