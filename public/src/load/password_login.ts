import { LoadAction, LoadLogined } from "./action";
import { LoginID, Password } from "./password_login/data";
import { Login, LoginError } from "./credential/data";

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
export const PASSWORD_MAX_LENGTH = 72;

export interface PasswordLoginComponent {
    initial: PasswordLoginState;
    setLoginID(loginID: string): PasswordLoginState;
    setPassword(password: string): PasswordLoginState;
    login(): [PasswordLoginState, Promise<PasswordLoginState>];
}

export type PasswordLoginState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "password-ok" }> |
    Readonly<{ state: "password-error", password: PasswordValidation }> |
    Readonly<{ state: "try-to-login" }> |
    Readonly<{ state: "failed-to-login", err: PasswordLoginError }> |
    Readonly<{ state: "success" }>;

export type PasswordValidation = Readonly<{
    loginID: ValidateState<ValidateLoginIDError>,
    password: ValidateState<ValidatePasswordError>,
}>

export type ValidateState<T> =
    Readonly<{ valid: true }> |
    Readonly<{ valid: false, err: Array<T> }>;

export type ValidateLoginIDError =
    Readonly<"empty">;

export type ValidatePasswordError =
    Readonly<"empty"> |
    Readonly<"too-long">;

export type PasswordLoginError =
    Readonly<{ type: "handled", err: Readonly<LoginError> }> |
    Readonly<{ type: "unknown", err: Readonly<string> }>;

function handled(err: LoginError): PasswordLoginError {
    return { type: "handled", err: err }
}
function unknownError(err: string): PasswordLoginError {
    return { type: "unknown", err: err }
}

export function initPasswordLoginComponent(action: LoadAction, logined: LoadLogined): PasswordLoginComponent {
    let passwordStore = initialPasswordStore;
    let validation = validate(passwordStore);

    return {
        initial: { state: "initial" },
        setLoginID(loginID: string): PasswordLoginState {
            passwordStore = {
                loginID: { loginID: loginID },
                password: passwordStore.password,
            }
            return validatePasswordStore();
        },
        setPassword(password: string): PasswordLoginState {
            passwordStore = {
                loginID: passwordStore.loginID,
                password: { password: password },
            }
            return validatePasswordStore();
        },
        login(): [PasswordLoginState, Promise<PasswordLoginState>] {
            const state = passwordState();
            if (state.state !== "password-ok") {
                return [state, Promise.resolve(state)];
            }

            return [
                { state: "try-to-login" },
                passwordLogin(),
            ]
        }
    }

    async function passwordLogin(): Promise<PasswordLoginState> {
        try {
            const result = await action.credential.login(login);
            if (result.authorized) {
                passwordStore = initialPasswordStore;
                logined();
                return { state: "success" }
            }

            return { state: "failed-to-login", err: handled(result.err) }
        } catch (err) {
            return { state: "failed-to-login", err: unknownError(`${err}`) }
        }
    }

    async function login(): Promise<Login> {
        return action.passwordLogin(passwordStore.loginID, passwordStore.password);
    }

    function validatePasswordStore(): PasswordLoginState {
        validation = validate(passwordStore);
        return passwordState();
    }

    function passwordState(): PasswordLoginState {
        if (
            validation.loginID.valid &&
            validation.password.valid
        ) {
            return { state: "password-ok" }
        }
        return {
            state: "password-error",
            password: validation,
        }
    }
}

type PasswordStore = Readonly<{ loginID: LoginID, password: Password }>;

const initialPasswordStore: PasswordStore = {
    loginID: { loginID: "" },
    password: { password: "" },
}

function validate(store: PasswordStore): PasswordValidation {
    const loginIDState = validateLoginID(store.loginID);
    const passwordState = validatePassword(store.password);

    return {
        loginID: loginIDState,
        password: passwordState,
    }
}

function validateLoginID(loginID: LoginID): ValidateState<ValidateLoginIDError> {
    const errors: Array<ValidateLoginIDError> = [];

    if (loginID.loginID.length === 0) {
        errors.push("empty");
    }

    if (errors.length > 0) {
        return { valid: false, err: errors }
    }
    return { valid: true }
}
function validatePassword(password: Password): ValidateState<ValidatePasswordError> {
    const errors: Array<ValidatePasswordError> = [];

    if (password.password.length === 0) {
        errors.push("empty");
    }
    if (password.password.length > PASSWORD_MAX_LENGTH) {
        errors.push("too-long");
    }

    if (errors.length > 0) {
        return { valid: false, err: errors }
    }
    return { valid: true }
}
