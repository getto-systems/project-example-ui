import { Login } from "../credential/data";
import { LoginID, Password } from "./data";

export interface PasswordLoginAction {
    (loginID: LoginID, password: Password): Promise<Login>;
}
