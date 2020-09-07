import { LoadAction } from "./action";

import { LoginID, Nonce, ApiRoles, StoreCredentialState } from "../ability/credential/data";
import { StoreCredentialApi } from "../ability/credential/action";
import { Password } from "../ability/password/data";
import {
    Session, ResetToken,
    CreateSessionBoard, CreateSessionState,
    PollingStatusState,
    ResetBoard, ResetState,
} from "../ability/password_reset/data";
import {
    PasswordResetTransition,
    CreateSessionStore, CreateSessionApi,
    PollingStatusApi,
    ResetStore, ResetApi,
} from "../ability/password_reset/action";

export type PasswordResetInit = [PasswordResetComponent, PasswordResetState]

export interface PasswordResetComponent {
    nextState(state: PasswordResetState): PasswordResetNextState

    createSession: CreateSessionComponent
    reset: ResetComponent
}

export type PasswordResetState =
    Readonly<{ type: "create-session", state: [CreateSessionBoard, CreateSessionState] }> |
    Readonly<{ type: "polling-status", state: [PollingStatusState] }> |
    Readonly<{ type: "reset", state: [ResetBoard, ResetState] }> |
    Readonly<{ type: "store-credential", state: [StoreCredentialState] }>
function CreateSession(state: [CreateSessionBoard, CreateSessionState]): PasswordResetState {
    return { type: "create-session", state }
}
function PollingStatus(state: [PollingStatusState]): PasswordResetState {
    return { type: "polling-status", state }
}
function Reset(state: [ResetBoard, ResetState]): PasswordResetState {
    return { type: "reset", state }
}
function StoreCredential(state: [StoreCredentialState]): PasswordResetState {
    return { type: "store-credential", state }
}

export type PasswordResetNextState =
    Readonly<{ hasNext: false }> |
    Readonly<{ hasNext: true, promise: Promise<PasswordResetState> }>
const passwordResetStatic: PasswordResetNextState = { hasNext: false }
function passwordResetNextState(promise: Promise<PasswordResetState>) {
    return { hasNext: true, promise }
}

export interface CreateSessionComponent {
    inputLoginID(loginID: LoginID): PasswordResetState
    changeLoginID(): PasswordResetState

    createSession(): PasswordResetState
}
export interface ResetComponent {
    inputLoginID(loginID: LoginID): PasswordResetState
    changeLoginID(): PasswordResetState

    inputPassword(password: Password): PasswordResetState
    changePassword(): PasswordResetState

    showPassword(): PasswordResetState
    hidePassword(): PasswordResetState

    reset(): PasswordResetState
}

export function initPasswordReset(action: LoadAction, url: Readonly<URL>, transition: PasswordResetTransition): PasswordResetInit {
    const createSession = new CreateSessionComponentImpl(action);
    const pollingStatus = new PollingStatusComponentImpl(action);
    const reset = new ResetComponentImpl(action);
    const storeCredential = new StoreCredentialComponentImpl(action);

    const component: PasswordResetComponent = {
        nextState,

        createSession,
        reset,
    }

    return [component, initialState()];

    function initialState(): PasswordResetState {
        // ログイン前の画面ではアンダースコアから始まるクエリを使用する
        const token = url.searchParams.get("_password_reset_token");
        if (token) {
            return reset.initialState({ token });
        }

        return createSession.currentState();
    }

    function nextState(state: PasswordResetState): PasswordResetNextState {
        switch (state.type) {
            case "create-session":
                return nextCreateSession(...state.state);

            case "polling-status":
                return nextPollingStatus(...state.state);

            case "reset":
                return nextReset(...state.state);

            case "store-credential":
                return nextStoreCredential(...state.state);
        }

        function nextCreateSession(_board: CreateSessionBoard, state: CreateSessionState): PasswordResetNextState {
            switch (state.state) {
                case "initial-create-session":
                case "try-to-create-session":
                case "failed-to-create-session":
                    return passwordResetStatic;

                case "succeed-to-create-session":
                    return passwordResetNextState(startPolling(state.session));

                default:
                    return assertNever(state);
            }
        }
        function nextPollingStatus(state: PollingStatusState): PasswordResetNextState {
            switch (state.state) {
                case "initial-polling-status":
                    return passwordResetStatic;

                case "try-to-polling-status":
                case "retry-to-polling-status":
                    return passwordResetNextState(polling(state.promise));

                case "failed-to-polling-status":
                case "succeed-to-polling-status":
                    return passwordResetStatic;
            }
        }
        function nextReset(_board: ResetBoard, state: ResetState): PasswordResetNextState {
            switch (state.state) {
                case "initial-reset":
                case "try-to-reset":
                case "failed-to-reset":
                    return passwordResetStatic;

                case "succeed-to-reset":
                    return passwordResetNextState(storeCredential.store(state.nonce, state.roles));
            }
        }
        function nextStoreCredential(state: StoreCredentialState): PasswordResetNextState {
            switch (state.state) {
                case "initial-store-credential":
                case "failed-to-store-credential":
                    return passwordResetStatic;

                case "try-to-store-credential":
                    return passwordResetNextState(state.promise.then(storeCredential.mapApi));

                case "succeed-to-store-credential":
                    transition.logined();
                    return passwordResetStatic;
            }
        }

        async function startPolling(session: Session): Promise<PasswordResetState> {
            return pollingStatus.initialState(session);
        }

        async function polling(promise: Promise<PollingStatusState>): Promise<PasswordResetState> {
            return PollingStatus([await promise]);
        }
    }
}

class CreateSessionComponentImpl implements CreateSessionComponent {
    store: CreateSessionStore
    api: CreateSessionApi

    constructor(action: LoadAction) {
        this.store = action.passwordReset.initCreateSessionStore(
            action.credential.initLoginIDRecord(),
        );
        this.api = action.passwordReset.initCreateSessionApi();
    }

    currentState(): PasswordResetState {
        return CreateSession([this.store.currentBoard(), this.api.currentState()]);
    }

    inputLoginID(loginID: LoginID): PasswordResetState {
        return this.mapStore(this.store.mapLoginID(this.store.loginID().input(loginID)));
    }
    changeLoginID(): PasswordResetState {
        return this.mapStore(this.store.mapLoginID(this.store.loginID().change()));
    }

    createSession(): PasswordResetState {
        const content = this.store.content();
        if (content.valid) {
            return this.mapApi(this.api.createSession(content.content));
        } else {
            return this.currentState();
        }
    }

    mapStore(board: CreateSessionBoard): PasswordResetState {
        return CreateSession([board, this.api.currentState()]);
    }
    mapApi(state: CreateSessionState): PasswordResetState {
        switch (state.state) {
            case "initial-create-session":
            case "try-to-create-session":
            case "failed-to-create-session":
                return CreateSession([this.store.currentBoard(), state]);

            case "succeed-to-create-session":
                this.store.clear();
                return CreateSession([this.store.currentBoard(), state]);
        }
    }
}

class PollingStatusComponentImpl {
    api: PollingStatusApi

    constructor(action: LoadAction) {
        this.api = action.passwordReset.initPollingStatusApi();
    }

    initialState(session: Session): PasswordResetState {
        return PollingStatus([this.api.pollingStatus(session)]);
    }
}

class ResetComponentImpl implements ResetComponent {
    store: ResetStore
    api: ResetApi

    constructor(action: LoadAction) {
        this.store = action.passwordReset.initResetStore(
            action.passwordReset.initResetTokenRecord(),
            action.credential.initLoginIDRecord(),
            action.password.initPasswordRecord(),
        );
        this.api = action.passwordReset.initResetApi();
    }

    initialState(resetToken: ResetToken): PasswordResetState {
        return this.mapStore(this.store.mapResetToken(this.store.resetToken().set(resetToken)));
    }
    currentState(): PasswordResetState {
        return Reset([this.store.currentBoard(), this.api.currentState()]);
    }

    inputLoginID(loginID: LoginID): PasswordResetState {
        return this.mapStore(this.store.mapLoginID(this.store.loginID().input(loginID)));
    }
    changeLoginID(): PasswordResetState {
        return this.mapStore(this.store.mapLoginID(this.store.loginID().change()));
    }

    inputPassword(password: Password): PasswordResetState {
        return this.mapStore(this.store.mapPassword(this.store.password().input(password)));
    }
    changePassword(): PasswordResetState {
        return this.mapStore(this.store.mapPassword(this.store.password().change()));
    }

    showPassword(): PasswordResetState {
        return this.mapStore(this.store.mapPassword(this.store.password().show()));
    }
    hidePassword(): PasswordResetState {
        return this.mapStore(this.store.mapPassword(this.store.password().hide()));
    }

    reset(): PasswordResetState {
        const content = this.store.content();
        if (content.valid) {
            return this.mapApi(this.api.reset(content.content));
        } else {
            return this.currentState();
        }
    }

    mapStore(board: ResetBoard): PasswordResetState {
        return Reset([board, this.api.currentState()]);
    }
    mapApi(state: ResetState): PasswordResetState {
        switch (state.state) {
            case "initial-reset":
            case "try-to-reset":
            case "failed-to-reset":
                return Reset([this.store.currentBoard(), state]);

            case "succeed-to-reset":
                this.store.clear();
                return Reset([this.store.currentBoard(), state]);
        }
    }
}

class StoreCredentialComponentImpl {
    api: StoreCredentialApi

    constructor(action: LoadAction) {
        this.api = action.credential.initStoreCredentialApi();
    }

    currentState(): PasswordResetState {
        return StoreCredential([this.api.currentState()]);
    }

    async store(nonce: Nonce, roles: ApiRoles): Promise<PasswordResetState> {
        return this.mapApi(this.api.store(nonce, roles));
    }

    mapApi(state: StoreCredentialState): PasswordResetState {
        return StoreCredential([state]);
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
