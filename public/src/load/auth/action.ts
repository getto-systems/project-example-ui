import { Auth } from "./data";

export interface AuthAction {
    renew(): Promise<Auth>;
}
