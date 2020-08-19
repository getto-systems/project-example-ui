import { LoadAction, LoadLogined } from "./action";
import { Password, LoginID, RawPassword } from "./password_login/data";
import { Login, LoginError, loginFailed } from "./credential/data";

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
export const PASSWORD_MAX_LENGTH = 72;

export interface PasswordLoginComponent {
    initial: PasswordLoginState;
    setPassword(password: Password): PasswordLoginState;
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

    return {
        initial: { state: "initial" },
        setPassword(password: Password): PasswordLoginState {
            passwordStore = inputPassword(password);
            return validPassword();
        },
        login(): [PasswordLoginState, Promise<PasswordLoginState>] {
            const state = validPassword();
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
        if (passwordStore.state === "input") {
            return action.passwordLogin(passwordStore.password);
        }
        return Promise.resolve(loginFailed("empty-input"));
    }

    function validPassword(): PasswordLoginState {
        if (passwordStore.state === "input") {
            if (
                !passwordStore.validation.loginID.valid ||
                !passwordStore.validation.password.valid
            ) {
                return {
                    state: "password-error",
                    password: passwordStore.validation,
                }
            }
        }
        return { state: "password-ok" }
    }
}

type PasswordStore =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "input", password: Password, validation: PasswordValidation }>;

const initialPasswordStore: PasswordStore = { state: "initial" }
function inputPassword(password: Password): PasswordStore {
    return { state: "input", password: password, validation: validate(password) }
}

function validate(password: Password): PasswordValidation {
    const loginIDState = validateLoginID(password.loginID);
    const passwordState = validatePassword(password.password);

    return {
        loginID: loginIDState,
        password: passwordState,
    }
}

function validateLoginID(loginID: LoginID): ValidateState<ValidateLoginIDError> {
    const errors: Array<ValidateLoginIDError> = [];

    if (loginID.length === 0) {
        errors.push("empty");
    }

    if (errors.length > 0) {
        return { valid: false, err: errors }
    }
    return { valid: true }
}
function validatePassword(password: RawPassword): ValidateState<ValidatePasswordError> {
    const errors: Array<ValidatePasswordError> = [];

    if (password.length === 0) {
        errors.push("empty");
    }
    if (password.length > PASSWORD_MAX_LENGTH) {
        errors.push("too-long");
    }

    if (errors.length > 0) {
        return { valid: false, err: errors }
    }
    return { valid: true }
}
