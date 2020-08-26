import { Renewer, RenewError, Loginer, LoginError, Authorized } from "./data";

export interface CredentialAction {
    renewApiRoles(renewer: Renewer): Promise<Authorized<RenewError>>;
    login(loginer: Loginer): Promise<Authorized<LoginError>>;
}
