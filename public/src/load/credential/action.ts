import { Renewer, Authorized } from "./data";

export interface CredentialAction {
    renewApiRoles(renewer: Renewer): Promise<Authorized>;
}
