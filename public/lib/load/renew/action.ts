import { NonceValue, Renew } from "../credential/data";

export interface RenewAction {
    (nonce: NonceValue): Promise<Renew>;
}
