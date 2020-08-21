import { LoadAction } from "./action";
import { PasswordLoginTransition } from "./password_login/action";
import { LoginID, Password, PasswordCharacter } from "./password_login/data";
import { LoginError } from "./credential/data";

export interface PasswordLoginComponent {
    initial: PasswordLoginState;

    setLoginID(loginID: LoginID): PasswordLoginState;
    setPassword(password: Password): PasswordLoginState;
    showPassword(): PasswordLoginState;
    hidePassword(): PasswordLoginState;

    login(): [PasswordLoginState, Promise<PasswordLoginState>];

    transitionToPasswordReset(): void;
}

export type PasswordLoginState =
    Readonly<{
        state: "active",
        auth: AuthState,
        loginID: LoginIDState,
        password: PasswordState,
    }> |
    Readonly<{ state: "success" }>

export type LoginIDState = Readonly<{ validation: LoginIDValidation }>;

export type LoginIDValidation = ValidationState<LoginIDValidationError>
export type LoginIDValidationError =
    Readonly<"empty">

export type PasswordState =
    Readonly<{ state: "hide", validation: PasswordValidation, character: PasswordCharacter }> |
    Readonly<{ state: "show", validation: PasswordValidation, character: PasswordCharacter, password: Password }>

export type PasswordValidation = ValidationState<PasswordValidationError>
export type PasswordValidationError =
    Readonly<"empty"> |
    Readonly<"too-long">

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
export const PASSWORD_MAX_LENGTH = 72;

export type AuthState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "failed-to-validation" }> |
    Readonly<{ state: "try-to-login" }> |
    Readonly<{ state: "failed-to-login", err: PasswordLoginError }>

export type PasswordLoginError =
    Readonly<{ type: "handled", err: Readonly<LoginError> }> |
    Readonly<{ type: "unknown", err: Readonly<string> }>

function handledError(err: LoginError): PasswordLoginError {
    return { type: "handled", err: err }
}
function unknownError(err: string): PasswordLoginError {
    return { type: "unknown", err: err }
}

export type ValidationState<T> =
    Readonly<{ valid: true }> |
    Readonly<{ valid: false, err: Array<T> }>

export function initPasswordLoginComponent(action: LoadAction, transition: PasswordLoginTransition): PasswordLoginComponent {
    let authState: AuthState = { state: "initial" }
    let loginIDStore = initialLoginIDStore;
    let passwordStore = initialPasswordStore;

    return {
        initial: currentState(),

        setLoginID(loginID: LoginID): PasswordLoginState {
            loginIDStore = storeLoginID(loginID);
            return currentState();
        },
        setPassword(password: Password): PasswordLoginState {
            passwordStore = storePassword(passwordStore, password);
            return currentState();
        },
        showPassword(): PasswordLoginState {
            passwordStore = showPassword(passwordStore);
            return currentState();
        },
        hidePassword(): PasswordLoginState {
            passwordStore = hidePassword(passwordStore);
            return currentState();
        },

        login(): [PasswordLoginState, Promise<PasswordLoginState>] {
            if (authState.state === "try-to-login") {
                const state = currentState();
                return [state, Promise.resolve(state)];
            }

            loginIDStore = storeLoginID(loginIDStore.loginID);
            passwordStore = storePassword(passwordStore, passwordStore.password);

            if (
                !loginIDStore.validation.valid ||
                !passwordStore.validation.valid
            ) {
                authState = { state: "failed-to-validation" }
                const state = currentState();
                return [state, Promise.resolve(state)];
            }

            authState = { state: "try-to-login" }

            return [
                currentState(),
                passwordLogin(),
            ]
        },

        transitionToPasswordReset(): void {
            transition.passwordReset();
        },
    }

    function currentState(): PasswordLoginState {
        return {
            state: "active",
            auth: authState,
            loginID: loginIDState(),
            password: passwordState(),
        }

        function loginIDState(): LoginIDState {
            return {
                validation: loginIDStore.validation,
            }
        }
        function passwordState(): PasswordState {
            if (passwordStore.visible) {
                return {
                    state: "show",
                    validation: passwordStore.validation,
                    character: passwordStore.character,
                    password: passwordStore.password,
                }
            } else {
                return {
                    state: "hide",
                    validation: passwordStore.validation,
                    character: passwordStore.character,
                }
            }
        }
    }

    async function passwordLogin(): Promise<PasswordLoginState> {
        try {
            const result = await action.credential.login(() => {
                return action.passwordLogin(loginIDStore.loginID, passwordStore.password);
            });
            if (result.authorized) {
                loginIDStore = initialLoginIDStore;
                passwordStore = initialPasswordStore;
                transition.logined();
                return { state: "success" }
            }

            authState = { state: "failed-to-login", err: handledError(result.err) }
        } catch (err) {
            authState = { state: "failed-to-login", err: unknownError(`${err}`) }
        }

        return currentState();
    }
}

type LoginIDStore = Readonly<{
    loginID: LoginID,
    validation: LoginIDValidation,
}>;
type PasswordStore = Readonly<{
    password: Password,
    character: PasswordCharacter,
    visible: boolean,
    validation: PasswordValidation,
}>;

const initialLoginIDStore: LoginIDStore = {
    loginID: { loginID: "" },
    validation: { valid: true },
}

function storeLoginID(loginID: LoginID): LoginIDStore {
    return {
        loginID: loginID,
        validation: validateLoginID(loginID),
    }
}
function validateLoginID(loginID: LoginID): LoginIDValidation {
    const errors: Array<LoginIDValidationError> = [];

    if (loginID.loginID.length === 0) {
        errors.push("empty");
    }

    if (errors.length > 0) {
        return { valid: false, err: errors }
    }
    return { valid: true }
}

const initialPasswordStore: PasswordStore = {
    password: { password: "" },
    character: { type: "ascii" },
    visible: false,
    validation: { valid: true },
}
function storePassword(store: PasswordStore, password: Password): PasswordStore {
    return {
        password: password,
        character: passwordCharacter(password),
        visible: store.visible,
        validation: validatePassword(password),
    }
}
function showPassword(store: PasswordStore): PasswordStore {
    return {
        password: store.password,
        character: store.character,
        visible: true,
        validation: store.validation,
    }
}
function hidePassword(store: PasswordStore): PasswordStore {
    return {
        password: store.password,
        character: store.character,
        visible: false,
        validation: store.validation,
    }
}
function passwordCharacter(password: Password): PasswordCharacter {
    for (let i = 0; i < password.password.length; i++) {
        if (password.password.charCodeAt(i) >= 128) {
            return { type: "complex" }
        }
    }
    return { type: "ascii" }
}
function validatePassword(password: Password): PasswordValidation {
    const errors: Array<PasswordValidationError> = [];

    if (password.password.length === 0) {
        errors.push("empty");
    }

    if (Buffer.byteLength(password.password, 'utf8') > PASSWORD_MAX_LENGTH) {
        errors.push("too-long");
    }

    if (errors.length > 0) {
        return { valid: false, err: errors }
    }
    return { valid: true }
}
