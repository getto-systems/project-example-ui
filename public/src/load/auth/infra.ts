import { Nonce, NonceValue, Credential, ApiRoles, Success } from "./data";

export type Infra = {
    idClient: IDClient,
    credentials: CredentialRepository,
}

export interface IDClient {
    renew(nonce: NonceValue): Promise<Credential>;
}

export interface CredentialRepository {
    findNonce(): Promise<Nonce>;
    storeRoles(roles: ApiRoles): Promise<Success>;
}
