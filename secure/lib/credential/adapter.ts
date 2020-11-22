import { ApiNonce, ApiRoles } from "./data"

export function packApiNonce(nonce: string): ApiNonce {
    return nonce as ApiNonce & string
}

export function unpackApiNonce(nonce: ApiNonce): string {
    return (nonce as unknown) as string
}

export function packApiRoles(roles: string[]): ApiRoles {
    return roles as ApiRoles & string[]
}

export function unpackApiRoles(roles: ApiRoles): string[] {
    return (roles as unknown) as string[]
}
