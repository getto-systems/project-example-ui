import { LoadAction } from "./action";

import { LoginID, NonceValue, ApiRoles, StoreState, StoreError } from "../wand/credential/data";
import { Password } from "../wand/password/data";
import {
    Session, ResetToken,
    CreateSessionBoard, CreateSessionState,
    PollingStatusState,
    ResetBoard, ResetState,
} from "../wand/password_reset/data";
import {
    PasswordResetTransition,
    CreateSessionStore, CreateSessionApi,
    PollingStatusApi,
    ResetStore, ResetApi,
} from "../wand/password_reset/action";

export type PasswordResetInit = [PasswordResetComponent, PasswordResetState]

export interface PasswordResetComponent {
    nextState(state: PasswordResetState): PasswordResetNextState

    createSession: CreateSessionComponent
    reset: ResetComponent
}

export type PasswordResetState =
    Readonly<{ type: "create-session", state: [CreateSessionBoard, CreateSessionState] }> |
    Readonly<{ type: "polling-status", state: PollingStatusState }> |
    Readonly<{ type: "reset", state: [ResetBoard, ResetState] }> |
    Readonly<{ type: "try-to-store-credential", promise: Promise<PasswordResetState> }> |
    Readonly<{ type: "failed-to-store-credential", err: StoreError }> |
    Readonly<{ type: "success" }>
function passwordResetCreateSession(state: [CreateSessionBoard, CreateSessionState]): PasswordResetState {
    return { type: "create-session", state }
}
function passwordResetPollingStatus(state: PollingStatusState): PasswordResetState {
    return { type: "polling-status", state }
}
function passwordReset(state: [ResetBoard, ResetState]): PasswordResetState {
    return { type: "reset", state }
}
function passwordResetTryToStoreCredential(promise: Promise<PasswordResetState>): PasswordResetState {
    return { type: "try-to-store-credential", promise }
}
function passwordResetFailedToStoreCredential(err: StoreError): PasswordResetState {
    return { type: "failed-to-store-credential", err }
}
const passwordResetSuccess: PasswordResetState = { type: "success" }

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
                return mapCreateSessionState(...state.state);

            case "polling-status":
                return mapPollingStatusState(state.state);

            case "reset":
                return mapResetState(...state.state);

            case "try-to-store-credential":
                return passwordResetNextState(state.promise);

            case "failed-to-store-credential":
            case "success":
                return passwordResetStatic;

            default:
                return assertNever(state);
        }

        function mapCreateSessionState(_board: CreateSessionBoard, state: CreateSessionState): PasswordResetNextState {
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
        function mapPollingStatusState(state: PollingStatusState): PasswordResetNextState {
            switch (state.state) {
                case "initial-polling-status":
                    return passwordResetStatic;

                case "try-to-polling-status":
                case "retry-to-polling-status":
                    return passwordResetNextState(polling(state.promise));

                case "failed-to-polling-status":
                case "succeed-to-polling-status":
                    return passwordResetStatic;

                default:
                    return assertNever(state);
            }
        }
        function mapResetState(_board: ResetBoard, state: ResetState): PasswordResetNextState {
            switch (state.state) {
                case "initial-reset":
                case "try-to-reset":
                case "failed-to-reset":
                    return passwordResetStatic;

                case "succeed-to-reset":
                    return passwordResetNextState(storeCredential(state.nonce, state.roles));

                default:
                    return assertNever(state);
            }
        }

        async function startPolling(session: Session): Promise<PasswordResetState> {
            createSession.clearStore();

            return pollingStatus.initialState(session);
        }

        async function polling(promise: Promise<PollingStatusState>): Promise<PasswordResetState> {
            return passwordResetPollingStatus(await promise);
        }

        async function storeCredential(nonce: NonceValue, roles: ApiRoles): Promise<PasswordResetState> {
            reset.clearStore();

            return passwordResetTryToStoreCredential(map(action.credential.store(nonce, roles)));

            async function map(promise: Promise<StoreState>): Promise<PasswordResetState> {
                const state = await promise;

                if (state.success) {
                    // 画面の遷移は state を返してから行う
                    setTimeout(() => {
                        transition.logined();
                    }, 0);

                    return passwordResetSuccess;
                } else {
                    return passwordResetFailedToStoreCredential(state.err);
                }
            }
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
        return passwordResetCreateSession([this.store.currentBoard(), this.api.currentState()]);
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
    clearStore(): void {
        this.store.clear();
    }

    mapStore(board: CreateSessionBoard): PasswordResetState {
        return passwordResetCreateSession([board, this.api.currentState()]);
    }
    mapApi(state: CreateSessionState): PasswordResetState {
        return passwordResetCreateSession([this.store.currentBoard(), state]);
    }
}

class PollingStatusComponentImpl {
    api: PollingStatusApi

    constructor(action: LoadAction) {
        this.api = action.passwordReset.initPollingStatusApi();
    }

    initialState(session: Session): PasswordResetState {
        return passwordResetPollingStatus(this.api.pollingStatus(session));
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
        return passwordReset([this.store.currentBoard(), this.api.currentState()]);
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
    clearStore(): void {
        this.store.clear();
    }

    mapStore(board: ResetBoard): PasswordResetState {
        return passwordReset([board, this.api.currentState()]);
    }
    mapApi(state: ResetState): PasswordResetState {
        return passwordReset([this.store.currentBoard(), state]);
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
