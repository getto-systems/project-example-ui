import { LoadAction } from "./action";
import { LoginID, StoreError, NonceValue, ApiRoles } from "./credential/data";
import { Password } from "./password/data";
import { PasswordResetTransition } from "./password_reset/action";
import { LoginBoard } from "./password_login/data";
import {
    ResetBoard,
    Session,
    ResetToken,
    CreateSessionState,
    PollingStatusState,
    ResetState,
} from "./password_reset/data";

export type PasswordResetInit = PasswordResetState

export type PasswordResetState =
    Readonly<{ type: "create-session", init: [[ResetBoard, CreateSessionState], CreateSessionComponent] }> |
    Readonly<{ type: "polling-status", init: [PollingStatusState, PollingStatusComponent] }> |
    Readonly<{ type: "reset", init: [[LoginBoard, ResetState], ResetComponent] }> |
    Readonly<{ type: "try-to-store-credential", next: Promise<PasswordResetState> }> |
    Readonly<{ type: "failed-to-store-credential", err: StoreError }> |
    Readonly<{ type: "success" }>
function passwordResetCreateSession(state: [ResetBoard, CreateSessionState], component: CreateSessionComponent): PasswordResetState {
    return { type: "create-session", init: [state, component] }
}
function passwordResetPollingStatus(state: PollingStatusState, component: PollingStatusComponent): PasswordResetState {
    return { type: "polling-status", init: [state, component] }
}
function passwordReset(state: [LoginBoard, ResetState], component: ResetComponent): PasswordResetState {
    return { type: "reset", init: [state, component] }
}
function passwordResetTryToStoreCredential(next: Promise<PasswordResetState>): PasswordResetState {
    return { type: "try-to-store-credential", next }
}
function passwordResetFailedToStoreCredential(err: StoreError): PasswordResetState {
    return { type: "failed-to-store-credential", err }
}
const passwordResetSuccess: PasswordResetState = { type: "success" }

export interface CreateSessionComponent {
    inputLoginID(loginID: LoginID): PasswordResetState
    changeLoginID(loginID: LoginID): PasswordResetState

    createSession(): PasswordResetState

    map(state: CreateSessionState): PasswordResetState
}
export interface PollingStatusComponent {
    map(state: PollingStatusState): PasswordResetState
}
export interface ResetComponent {
    inputLoginID(loginID: LoginID): PasswordResetState
    changeLoginID(loginID: LoginID): PasswordResetState

    inputPassword(password: Password): PasswordResetState
    changePassword(password: Password): PasswordResetState

    showPassword(): PasswordResetState
    hidePassword(): PasswordResetState

    reset(): PasswordResetState

    map(state: ResetState): PasswordResetState
}

export function initPasswordReset(url: Readonly<URL>, action: LoadAction, transition: PasswordResetTransition): PasswordResetInit {
    return initialState();

    function initialState(): PasswordResetState {
        // ログイン前の画面ではアンダースコアから始まるクエリを使用する
        const resetToken = url.searchParams.get("_password_reset_token");
        if (resetToken) {
            return passwordReset(...initResetComponent(action, transition, { token: resetToken }));
        }

        return passwordResetCreateSession(...initCreateSessionComponent(action));
    }
}

function initCreateSessionComponent(action: LoadAction): [[ResetBoard, CreateSessionState], CreateSessionComponent] {
    const board = action.passwordReset.initResetBoardStore(
        action.credential.validateLoginID,
    );
    const api = action.passwordReset.initCreateSessionApi();

    const component: CreateSessionComponent = {
        inputLoginID,
        changeLoginID,

        createSession,

        map,
    }

    return [[board.currentBoard(), api.currentState()], component]

    function inputLoginID(loginID: LoginID): PasswordResetState {
        return passwordResetCreateSession([board.inputLoginID(loginID), api.currentState()], component);
    }
    function changeLoginID(loginID: LoginID): PasswordResetState {
        return passwordResetCreateSession([board.changeLoginID(loginID), api.currentState()], component);
    }

    function createSession(): PasswordResetState {
        const content = board.content();
        if (!content.valid) {
            return passwordResetCreateSession([board.currentBoard(), api.currentState()], component);
        }
        return passwordResetCreateSession([board.currentBoard(), api.createSession(content.loginID)], component);
    }

    function map(state: CreateSessionState): PasswordResetState {
        switch (state.state) {
            case "initial-create-session":
            case "try-to-create-session":
            case "failed-to-create-session":
                return passwordResetCreateSession([board.currentBoard(), state], component);

            case "succeed-to-create-session":
                return passwordResetPollingStatus(...initPollingStatusComponent(action, state.session));

            default:
                return assertNever(state);
        }
    }
}
function initPollingStatusComponent(action: LoadAction, session: Session): [PollingStatusState, PollingStatusComponent] {
    const api = action.passwordReset.initPollingStatusApi();

    const component: PollingStatusComponent = {
        map,
    }

    return [api.pollingStatus(session), component];

    function map(state: PollingStatusState): PasswordResetState {
        return passwordResetPollingStatus(state, component);
    }
}
function initResetComponent(action: LoadAction, transition: PasswordResetTransition, resetToken: ResetToken): [[LoginBoard, ResetState], ResetComponent] {
    const board = action.passwordLogin.initLoginBoardStore(
        action.credential.validateLoginID,
        action.password.validatePassword,
        action.password.checkPasswordCharacter,
    );
    const api = action.passwordReset.initResetApi();

    const component: ResetComponent = {
        inputLoginID,
        changeLoginID,

        inputPassword,
        changePassword,

        showPassword,
        hidePassword,

        reset,

        map,
    }

    return [[board.currentBoard(), api.currentState()], component]

    function inputLoginID(loginID: LoginID): PasswordResetState {
        return passwordReset([board.inputLoginID(loginID), api.currentState()], component);
    }
    function changeLoginID(loginID: LoginID): PasswordResetState {
        return passwordReset([board.changeLoginID(loginID), api.currentState()], component);
    }

    function inputPassword(password: Password): PasswordResetState {
        return passwordReset([board.inputPassword(password), api.currentState()], component);
    }
    function changePassword(password: Password): PasswordResetState {
        return passwordReset([board.changePassword(password), api.currentState()], component);
    }

    function showPassword(): PasswordResetState {
        return passwordReset([board.showPassword(), api.currentState()], component);
    }
    function hidePassword(): PasswordResetState {
        return passwordReset([board.hidePassword(), api.currentState()], component);
    }

    function reset(): PasswordResetState {
        const content = board.content();
        if (!content.valid) {
            return passwordReset([board.currentBoard(), api.currentState()], component);
        }
        return passwordReset([board.currentBoard(), api.reset(resetToken, content.loginID, content.password)], component);
    }

    function map(state: ResetState): PasswordResetState {
        switch (state.state) {
            case "initial-reset":
            case "try-to-reset":
            case "failed-to-reset":
                return passwordReset([board.currentBoard(), state], component);

            case "succeed-to-reset":
                board.clear();
                return passwordResetTryToStoreCredential(storeCredential(state.nonce, state.roles));

            default:
                return assertNever(state);
        }

        async function storeCredential(nonce: NonceValue, roles: ApiRoles): Promise<PasswordResetState> {
            const result = await action.credential.store(nonce, roles);
            if (!result.success) {
                return passwordResetFailedToStoreCredential(result.err);
            }

            // 画面の遷移は state を返してから行う
            setTimeout(() => {
                transition.logined();
            }, 0);

            return passwordResetSuccess;
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
