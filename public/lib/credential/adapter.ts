import { ApiCredential, ApiRoles, ApiRole } from "./data"

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
