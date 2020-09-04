import { LoadAction } from "./action";

import {
    PasswordResetTransition,
    CreateSessionStore, CreateSessionApi,
    PollingStatusApi,
    ResetStore, ResetApi,
} from "./password_reset/action";

import { LoginID, NonceValue, ApiRoles, StoreState, StoreError } from "./credential/data";
import { Password } from "./password/data";
import {
    Session, ResetToken,
    CreateSessionBoard, CreateSessionState,
    PollingStatusState,
    ResetBoard, ResetState,
} from "./password_reset/data";

export type PasswordResetInit = [PasswordResetState, PasswordResetComponent]

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

export interface PasswordResetComponent {
    nextState(state: PasswordResetState): PasswordResetNextState

    createSession: CreateSessionComponent
    reset: ResetComponent
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
    changeLoginID(loginID: LoginID): PasswordResetState

    createSession(): PasswordResetState
}
export interface ResetComponent {
    inputLoginID(loginID: LoginID): PasswordResetState
    changeLoginID(loginID: LoginID): PasswordResetState

    inputPassword(password: Password): PasswordResetState
    changePassword(password: Password): PasswordResetState

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

    return [initialState(), component];

    function initialState(): PasswordResetState {
        // ログイン前の画面ではアンダースコアから始まるクエリを使用する
        const token = url.searchParams.get("_password_reset_token");
        if (token) {
            return reset.initialState({ token });
        }

        return createSession.initialState();
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
            action.credential.validateLoginID,
        );
        this.api = action.passwordReset.initCreateSessionApi();
    }

    initialState(): PasswordResetState {
        return passwordResetCreateSession([this.store.currentBoard(), this.api.currentState()]);
    }

    inputLoginID(loginID: LoginID): PasswordResetState {
        return passwordResetCreateSession([this.store.inputLoginID(loginID), this.api.currentState()]);
    }
    changeLoginID(loginID: LoginID): PasswordResetState {
        return passwordResetCreateSession([this.store.changeLoginID(loginID), this.api.currentState()]);
    }

    createSession(): PasswordResetState {
        const content = this.store.content();
        if (content.valid) {
            return passwordResetCreateSession([this.store.currentBoard(), this.api.createSession(content.content)]);
        } else {
            return passwordResetCreateSession([this.store.currentBoard(), this.api.currentState()]);
        }
    }
    clearStore(): void {
        this.store.clear();
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
            action.credential.validateLoginID,
            action.password.validatePassword,
            action.password.checkPasswordCharacter,
        );
        this.api = action.passwordReset.initResetApi();
    }

    initialState(resetToken: ResetToken): PasswordResetState {
        return passwordReset([this.store.setResetToken(resetToken), this.api.currentState()]);
    }

    inputLoginID(loginID: LoginID): PasswordResetState {
        return passwordReset([this.store.inputLoginID(loginID), this.api.currentState()]);
    }
    changeLoginID(loginID: LoginID): PasswordResetState {
        return passwordReset([this.store.changeLoginID(loginID), this.api.currentState()]);
    }

    inputPassword(password: Password): PasswordResetState {
        return passwordReset([this.store.inputPassword(password), this.api.currentState()]);
    }
    changePassword(password: Password): PasswordResetState {
        return passwordReset([this.store.changePassword(password), this.api.currentState()]);
    }

    showPassword(): PasswordResetState {
        return passwordReset([this.store.showPassword(), this.api.currentState()]);
    }
    hidePassword(): PasswordResetState {
        return passwordReset([this.store.hidePassword(), this.api.currentState()]);
    }

    reset(): PasswordResetState {
        const content = this.store.content();
        if (content.valid) {
            return passwordReset([this.store.currentBoard(), this.api.reset(content.content)]);
        } else {
            return passwordReset([this.store.currentBoard(), this.api.currentState()]);
        }
    }
    clearStore(): void {
        this.store.clear();
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
