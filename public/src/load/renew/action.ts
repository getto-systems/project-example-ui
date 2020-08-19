import { NonceValue, Renewed } from "../credential/data";

export interface RenewAction {
    (nonce: NonceValue): Promise<Renewed>;
}
