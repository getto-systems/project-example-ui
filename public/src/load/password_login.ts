import { LoadAction } from "./action";

export interface PasswordLoginComponent {
    initial: PasswordLoginState;
}

export type PasswordLoginState =
    Readonly<{ awesome: string }>;

export type PasswordLoginError = Readonly<{
    err: string,
}>

export function initPasswordLoginComponent(_action: LoadAction): PasswordLoginComponent {
    return {
        initial: { awesome: "something else" },
    }
}
