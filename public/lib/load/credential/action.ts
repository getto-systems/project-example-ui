import { NonceValue, ApiRoles, LoginID, LoginIDValidationError, RenewState, StoreState } from "./data";

export interface CredentialAction {
    validateLoginID(loginID: LoginID): Array<LoginIDValidationError>

    store(nonce: NonceValue, roles: ApiRoles): Promise<StoreState>
    renew(): Promise<RenewState>
}
