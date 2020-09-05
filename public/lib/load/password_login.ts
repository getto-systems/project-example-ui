import { LoadAction } from "./action";

import { LoginID, NonceValue, ApiRoles, StoreCredentialState } from "../ability/credential/data";
import { StoreCredentialApi } from "../ability/credential/action";
import { Password } from "../ability/password/data";
import { LoginBoard, LoginState } from "../ability/password_login/data";
import { PasswordLoginTransition, LoginStore, LoginApi } from "../ability/password_login/action";

export type PasswordLoginInit = [PasswordLoginComponent, PasswordLoginState]

export interface PasswordLoginComponent {
    nextState(state: PasswordLoginState): PasswordLoginNextState

    login: LoginComponent
}

export type PasswordLoginState =
    Readonly<{ type: "login", state: [LoginBoard, LoginState] }> |
    Readonly<{ type: "store-credential", state: [StoreCredentialState] }>
function Login(state: [LoginBoard, LoginState]): PasswordLoginState {
    return { type: "login", state }
}
function StoreCredential(state: [StoreCredentialState]): PasswordLoginState {
    return { type: "store-credential", state }
}

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
    const login = new LoginComponentImpl(action);
    const storeCredential = new StoreCredentialComponentImpl(action);

    const component = {
        nextState,

        login,
    }

    return [component, login.currentState()]

    function nextState(state: PasswordLoginState): PasswordLoginNextState {
        switch (state.type) {
            case "login":
                return nextLogin(...state.state);

            case "store-credential":
                return nextStoreCredential(...state.state);
        }

    }
    function nextLogin(_board: LoginBoard, state: LoginState): PasswordLoginNextState {
        switch (state.state) {
            case "initial-login":
            case "failed-to-login":
                return passwordLoginStatic;

            case "try-to-login":
                return passwordLoginNextState(state.promise.then(login.mapApi));

            case "succeed-to-login":
                return passwordLoginNextState(storeCredential.store(state.nonce, state.roles));
        }
    }
    function nextStoreCredential(state: StoreCredentialState): PasswordLoginNextState {
        switch (state.state) {
            case "initial-store-credential":
            case "failed-to-store-credential":
                return passwordLoginStatic;

            case "try-to-store-credential":
                return passwordLoginNextState(state.promise.then(storeCredential.mapApi));

            case "succeed-to-store-credential":
                transition.logined();
                return passwordLoginStatic;
        }
    }
}

class LoginComponentImpl implements LoginComponent {
    store: LoginStore
    api: LoginApi

    constructor(action: LoadAction) {
        this.store = action.passwordLogin.initLoginStore(
            action.credential.initLoginIDRecord(),
            action.password.initPasswordRecord(),
        );
        this.api = action.passwordLogin.initLoginApi();
    }

    currentState(): PasswordLoginState {
        return Login([this.store.currentBoard(), this.api.currentState()]);
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
        return Login([board, this.api.currentState()]);
    }
    mapApi(state: LoginState): PasswordLoginState {
        switch (state.state) {
            case "initial-login":
            case "try-to-login":
            case "failed-to-login":
                return Login([this.store.currentBoard(), state]);

            case "succeed-to-login":
                this.store.clear();
                return Login([this.store.currentBoard(), state]);
        }
    }
}

class StoreCredentialComponentImpl {
    api: StoreCredentialApi

    constructor(action: LoadAction) {
        this.api = action.credential.initStoreCredentialApi();
    }

    currentState(): PasswordLoginState {
        return StoreCredential([this.api.currentState()]);
    }

    async store(nonce: NonceValue, roles: ApiRoles): Promise<PasswordLoginState> {
        return this.mapApi(this.api.store(nonce, roles));
    }

    mapApi(state: StoreCredentialState): PasswordLoginState {
        return StoreCredential([state]);
    }
}
