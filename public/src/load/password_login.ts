import { LoadAction } from "./action";
import { Password } from "./password_login/data";
import { Success, success } from "./password_login/infra";

export interface PasswordLoginComponent {
    initial: PasswordLoginState;
    setPassword(password: Password): void;
    login(): Promise<Success>;
}

export type PasswordLoginState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "input", password: Password }>;

export type PasswordLoginError = Readonly<{
    err: string,
}>

export function initPasswordLoginComponent(_action: LoadAction): PasswordLoginComponent {
    return {
        initial: { state: "initial" },
        setPassword(_password: Password): void {
            console.log("set password"); // TODO ここでパスワード情報をアップデート
        },
        async login(): Promise<Success> {
            return success;
        }
    }
}
