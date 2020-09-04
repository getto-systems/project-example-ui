import { LoadAction } from "./action";

import { PasswordLoginTransition, LoginStore, LoginApi } from "../action/password_login/action";

import { LoginID, NonceValue, ApiRoles, StoreError } from "../action/credential/data";
import { Password } from "../action/password/data";
import { LoginBoard, LoginState } from "../action/password_login/data";

export type PasswordLoginInit = [PasswordLoginComponent, PasswordLoginState]

export interface PasswordLoginComponent {
    nextState(state: PasswordLoginState): PasswordLoginNextState

    login: LoginComponent
}

export type PasswordLoginState =
    Readonly<{ type: "login", state: [LoginBoard, LoginState] }> |
    Readonly<{ type: "try-to-store-credential", promise: Promise<PasswordLoginState> }> |
    Readonly<{ type: "failed-to-store-credential", err: StoreError }> |
    Readonly<{ type: "success" }>
function passwordLogin(state: [LoginBoard, LoginState]): PasswordLoginState {
    return { type: "login", state }
}
function passwordLoginTryToStoreCredential(promise: Promise<PasswordLoginState>): PasswordLoginState {
    return { type: "try-to-store-credential", promise }
}
function passwordLoginFailedToStoreCredential(err: StoreError): PasswordLoginState {
    return { type: "failed-to-store-credential", err }
}
const passwordLoginSuccess: PasswordLoginState = { type: "success" }

export type PasswordLoginNextState =
    Readonly<{ hasNext: false }> |
    Readonly<{ hasNext: true, promise: Promise<PasswordLoginState> }>
const passwordLoginStatic: PasswordLoginNextState = { hasNext: false }
function passwordLoginNextState(promise: Promise<PasswordLoginState>) {
    return { hasNext: true, promise }
}

export interface LoginComponent {
    currentState(): PasswordLoginState

    inputLoginID(loginID: LoginID): PasswordLoginState
    changeLoginID(): PasswordLoginState

    inputPassword(password: Password): PasswordLoginState
    changePassword(): PasswordLoginState

    showPassword(): PasswordLoginState
    hidePassword(): PasswordLoginState

    login(): PasswordLoginState
}

export function initPasswordLogin(action: LoadAction, transition: PasswordLoginTransition): PasswordLoginInit {
    const login = new LoginComponentImpl(action, transition);
    const component = {
        nextState,

        login,
    }

    return [component, login.currentState()]

    function nextState(state: PasswordLoginState): PasswordLoginNextState {
        switch (state.type) {
            case "login":
                return nextLogin(...state.state);

            case "try-to-store-credential":
                return passwordLoginNextState(state.promise);

            case "failed-to-store-credential":
            case "success":
                return passwordLoginStatic;
        }

    }
    function nextLogin(_board: LoginBoard, state: LoginState): PasswordLoginNextState {
        switch (state.state) {
            case "initial-login":
            case "failed-to-login":
            case "succeed-to-login":
                return passwordLoginStatic;

            case "try-to-login":
                return passwordLoginNextState(state.promise.then(login.mapApi));
        }
    }
}

interface StoreCredential {
    (nonce: NonceValue, roles: ApiRoles): Promise<PasswordLoginState>
}

class LoginComponentImpl implements LoginComponent {
    store: LoginStore
    api: LoginApi

    storeCredential: StoreCredential

    constructor(action: LoadAction, transition: PasswordLoginTransition) {
        this.store = action.passwordLogin.initLoginStore(
            action.credential.initLoginIDRecord(),
            action.password.initPasswordRecord(),
        );
        this.api = action.passwordLogin.initLoginApi();

        this.storeCredential = storeCredential;

        async function storeCredential(nonce: NonceValue, roles: ApiRoles): Promise<PasswordLoginState> {
            const result = await action.credential.store(nonce, roles);
            if (!result.success) {
                return passwordLoginFailedToStoreCredential(result.err);
            }

            // 画面の遷移は state を返してから行う
            setTimeout(() => {
                transition.logined();
            }, 0);

            return passwordLoginSuccess;
        }
    }

    currentState(): PasswordLoginState {
        return passwordLogin([this.store.currentBoard(), this.api.currentState()]);
    }

    inputLoginID(loginID: LoginID): PasswordLoginState {
        return this.mapStore(this.store.mapLoginID(this.store.loginID().input(loginID)));
    }
    changeLoginID(): PasswordLoginState {
        return this.mapStore(this.store.mapLoginID(this.store.loginID().change()));
    }

    inputPassword(password: Password): PasswordLoginState {
        return this.mapStore(this.store.mapPassword(this.store.password().input(password)));
    }
    changePassword(): PasswordLoginState {
        return this.mapStore(this.store.mapPassword(this.store.password().change()));
    }

    showPassword(): PasswordLoginState {
        return this.mapStore(this.store.mapPassword(this.store.password().show()));
    }
    hidePassword(): PasswordLoginState {
        return this.mapStore(this.store.mapPassword(this.store.password().hide()));
    }

    login(): PasswordLoginState {
        const content = this.store.content();
        if (content.valid) {
            return this.mapApi(this.api.login(content.content));
        } else {
            return this.currentState();
        }
    }

    mapStore(board: LoginBoard): PasswordLoginState {
        return passwordLogin([board, this.api.currentState()]);
    }
    mapApi(state: LoginState): PasswordLoginState {
        switch (state.state) {
            case "initial-login":
            case "try-to-login":
            case "failed-to-login":
                return passwordLogin([this.store.currentBoard(), state]);

            case "succeed-to-login":
                this.store.clear();
                return passwordLoginTryToStoreCredential(this.storeCredential(state.nonce, state.roles));
        }
    }
}
