import { Nonce, NonceValue, ApiRoles } from "./data";

export type Infra = {
    credentials: CredentialRepository,
}

export interface CredentialRepository {
    findNonce(): Promise<Nonce>;
    storeRoles(roles: ApiRoles): Promise<Success>;
    storeNonce(nonce: NonceValue): Promise<Success>;
}

export type Success = Readonly<true>;
export const success: Success = true
