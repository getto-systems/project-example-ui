import { Login } from "../credential/data";
import { Password } from "./data";

export interface PasswordLoginAction {
    (password: Password): Promise<Login>;
}
