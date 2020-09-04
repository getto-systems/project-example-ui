import { Infra, PasswordResetClient, SendTokenError } from "./infra";

import {
    LoginIDValidator,
} from "../credential/action";
import {
    PasswordValidator,
    PasswordCharacterChecker,
} from "../password/action";
import {
    PasswordResetAction,
    CreateSessionStore, CreateSessionApi,
    PollingStatusApi,
    ResetStore, ResetApi,
} from "./action";

import { LoginID, LoginIDBoard } from "../credential/data";
import {
    Password,
    PasswordBoard,
    PasswordView, showPassword, hidePassword, updatePasswordView,
} from "../password/data";
import {
    Session,
    ResetToken,

    CreateSessionBoard, CreateSessionBoardContent,
    CreateSessionState, initialCreateSession, tryToCreateSession, delayedToCreateSession, failedToCreateSession, succeedToCreateSession,

    PollingStatusState, initialPollingStatus, tryToPollingStatus, retryToPollingStatus, failedToPollingStatus, succeedToPollingStatus,

    ResetBoard, ResetBoardContent,
    ResetState, initialReset, tryToReset, delayedToReset, failedToReset, succeedToReset,

    ValidContent, validContent, invalidContent,
} from "./data";

// 「遅くなっています」を表示するまでの秒数
const CREATE_SESSION_DELAY_LIMIT_SECOND = 1;
const RESET_DELAY_LIMIT_SECOND = 1;

export function passwordResetAction(infra: Infra): PasswordResetAction {
    return {
        initCreateSessionStore,
        initCreateSessionApi,

        initPollingStatusApi,

        initResetStore,
        initResetApi,
    }

    function initCreateSessionStore(
        loginIDValidator: LoginIDValidator,
    ): CreateSessionStore {
        return new CreateSessionStoreImpl(
            loginIDValidator,
        );
    }
    function initCreateSessionApi(): CreateSessionApi {
        return new CreateSessionApiImpl(
            infra.passwordResetClient,
        );
    }

    function initPollingStatusApi(): PollingStatusApi {
        return new PollingStatusApiImpl(infra.passwordResetClient);
    }

    function initResetStore(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ): ResetStore {
        return new ResetStoreImpl(
            loginIDValidator,
            passwordValidator,
            passwordCharacterChekcer,
        );
    }
    function initResetApi(): ResetApi {
        return new ResetApiImpl(
            infra.passwordResetClient,
        );
    }
}

export type LoginIDBoardSource =
    { loginID: LoginID, board: LoginIDBoard }
const emptyLoginID: LoginIDBoardSource = {
    loginID: { loginID: "" },
    board: { err: [] },
}

class CreateSessionStoreImpl implements CreateSessionStore {
    loginIDValidator: LoginIDValidator

    loginID: LoginIDBoardSource

    constructor(
        loginIDValidator: LoginIDValidator,
    ) {
        this.loginIDValidator = loginIDValidator;

        this.loginID = emptyLoginID;
    }

    currentBoard(): CreateSessionBoard {
        return {
            loginID: this.loginID.board,
        }
    }

    inputLoginID(loginID: LoginID): CreateSessionBoard {
        return this.updateLoginID(loginID);
    }
    changeLoginID(loginID: LoginID): CreateSessionBoard {
        return this.updateLoginID(loginID);
    }
    updateLoginID(loginID: LoginID): CreateSessionBoard {
        this.loginID.loginID = loginID;
        this.loginID.board = { err: this.loginIDValidator(loginID) };
        return this.currentBoard();
    }
    validateLoginID(loginID: LoginID): void {
        this.loginID.board = { err: this.loginIDValidator(loginID) };
    }

    content(): ValidContent<CreateSessionBoardContent> {
        const loginID = this.currentLoginID();

        this.validateLoginID(loginID);

        if (this.loginID.board.err.length > 0) {
            return invalidContent();
        }

        return validContent({ loginID });
    }
    currentLoginID(): LoginID {
        return this.loginID.loginID;
    }

    clear(): void {
        this.loginID = emptyLoginID;
    }
}

class CreateSessionApiImpl implements CreateSessionApi {
    client: PasswordResetClient

    state: CreateSessionState

    constructor(client: PasswordResetClient) {
        this.client = client;

        this.state = initialCreateSession;
    }

    currentState(): CreateSessionState {
        return this.state;
    }

    updateState(state: CreateSessionState): CreateSessionState {
        this.state = state;
        return this.state;
    }

    createSession(content: CreateSessionBoardContent): CreateSessionState {
        if (this.state.state === "try-to-create-session") {
            return this.currentState();
        } else {
            return this.updateState(tryToCreateSession(this.delayed(this.requestCreateSession(content))));
        }
    }

    async requestCreateSession(content: CreateSessionBoardContent): Promise<CreateSessionState> {
        const response = await this.client.createSession(content.loginID);
        if (response.success) {
            return succeedToCreateSession(response.session);
        } else {
            return failedToCreateSession(response.err);
        }
    }

    async delayed(promise: Promise<CreateSessionState>): Promise<CreateSessionState> {
        try {
            const delayedMarker = { delayed: true }
            const winner = await Promise.race([
                promise,
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(delayedMarker);
                    }, CREATE_SESSION_DELAY_LIMIT_SECOND * 1000);
                }),
            ]);

            if (winner === delayedMarker) {
                return delayedToCreateSession(promise);
            }

            return await promise;
        } catch (err) {
            return failedToCreateSession({ type: "infra-error", err });
        }
    }
}

type SendTokenState =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "success" }> |
    Readonly<{ state: "failed", err: SendTokenError }>

const POLLING_WAIT_SECOND = 1;

class PollingStatusApiImpl implements PollingStatusApi {
    client: PasswordResetClient

    state: PollingStatusState
    sendTokenState: SendTokenState

    constructor(client: PasswordResetClient) {
        this.client = client;

        this.state = initialPollingStatus;
        this.sendTokenState = { state: "initial" }
    }

    currentState(): PollingStatusState {
        return this.state;
    }
    updateState(state: PollingStatusState): PollingStatusState {
        this.state = state;
        return this.state;
    }

    pollingStatus(session: Session): PollingStatusState {
        this.sendToken();

        return this.updateState(tryToPollingStatus(this.requestPollingStatus(session)));
    }

    async sendToken() {
        if (this.sendTokenState.state !== "initial") {
            return;
        }

        try {
            const response = await this.client.sendToken();
            if (response.success) {
                this.sendTokenState = { state: "success" }
            } else {
                this.sendTokenState = { state: "failed", err: response.err }
            }
        } catch (err) {
            this.sendTokenState = { state: "failed", err: { type: "infra-error", err } }
        }
    }

    async requestPollingStatus(session: Session): Promise<PollingStatusState> {
        if (this.sendTokenState.state === "failed") {
            return failedToPollingStatus(this.sendTokenState.err);
        }

        try {
            const response = await this.client.getStatus(session);

            switch (response.state) {
                case "polling":
                    return retryToPollingStatus(
                        response.dest,
                        response.status,
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                this.requestPollingStatus(session).then(resolve).catch(reject);
                            }, POLLING_WAIT_SECOND * 1000);
                        }),
                    );

                case "done":
                    return succeedToPollingStatus(response.dest, response.status);

                case "failed":
                    return failedToPollingStatus(response.err);

                default:
                    return assertNever(response);
            }
        } catch (err) {
            return failedToPollingStatus({ type: "infra-error", err });
        }
    }
}

export type ResetTokenBoardSource =
    { resetToken: ResetToken }
const emptyResetToken: ResetTokenBoardSource = {
    resetToken: { token: "" },
}

export type PasswordBoardSource =
    { password: Password, board: PasswordBoard }
const emptyPassword: PasswordBoardSource = {
    password: { password: "" },
    board: {
        character: { complex: false },
        view: { show: false },
        err: [],
    },
}

class ResetStoreImpl implements ResetStore {
    resetToken: ResetTokenBoardSource
    loginID: LoginIDBoardSource
    password: PasswordBoardSource

    loginIDValidator: LoginIDValidator
    passwordValidator: PasswordValidator
    passwordCharacterChekcer: PasswordCharacterChecker

    constructor(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ) {
        this.loginIDValidator = loginIDValidator;
        this.passwordValidator = passwordValidator;
        this.passwordCharacterChekcer = passwordCharacterChekcer;

        this.resetToken = emptyResetToken;
        this.loginID = emptyLoginID;
        this.password = emptyPassword;
    }

    currentBoard(): ResetBoard {
        return {
            loginID: this.loginID.board,
            password: this.password.board,
        }
    }

    setResetToken(resetToken: ResetToken): ResetBoard {
        this.resetToken.resetToken = resetToken;
        return this.currentBoard();
    }

    inputLoginID(loginID: LoginID): ResetBoard {
        return this.updateLoginID(loginID);
    }
    changeLoginID(loginID: LoginID): ResetBoard {
        return this.updateLoginID(loginID);
    }
    updateLoginID(loginID: LoginID): ResetBoard {
        this.loginID.loginID = loginID;
        this.loginID.board = { err: this.loginIDValidator(loginID) };
        return this.currentBoard();
    }
    validateLoginID(loginID: LoginID): void {
        this.loginID.board = { err: this.loginIDValidator(loginID) };
    }

    inputPassword(password: Password): ResetBoard {
        return this.updatePassword(password);
    }
    changePassword(password: Password): ResetBoard {
        return this.updatePassword(password);
    }
    updatePassword(password: Password): ResetBoard {
        this.password.password = password;
        this.password.board = {
            character: this.passwordCharacterChekcer(password),
            view: updatePasswordView(this.password.board.view, password),
            err: this.passwordValidator(password),
        }
        return this.currentBoard();
    }
    validatePassword(password: Password): void {
        this.password.board = {
            character: this.password.board.character,
            view: this.password.board.view,
            err: this.passwordValidator(password),
        }
    }

    showPassword(): ResetBoard {
        return this.updatePasswordView(showPassword(this.currentPassword()));
    }
    hidePassword(): ResetBoard {
        return this.updatePasswordView(hidePassword);
    }
    updatePasswordView(view: PasswordView): ResetBoard {
        this.password.board = { character: this.password.board.character, view, err: this.password.board.err };
        return this.currentBoard();
    }

    content(): ValidContent<ResetBoardContent> {
        const resetToken = this.currentResetToken();
        const loginID = this.currentLoginID();
        const password = this.currentPassword();

        this.validateLoginID(loginID);
        this.validatePassword(password);

        if (
            resetToken.token === "" ||
            this.loginID.board.err.length > 0 ||
            this.password.board.err.length > 0
        ) {
            return invalidContent();
        }

        return validContent({ resetToken, loginID, password });
    }
    currentResetToken(): ResetToken {
        return this.resetToken.resetToken;
    }
    currentLoginID(): LoginID {
        return this.loginID.loginID;
    }
    currentPassword(): Password {
        return this.password.password;
    }

    clear(): void {
        this.resetToken = emptyResetToken;
        this.loginID = emptyLoginID;
        this.password = emptyPassword;
    }
}

class ResetApiImpl implements ResetApi {
    client: PasswordResetClient

    state: ResetState

    constructor(client: PasswordResetClient) {
        this.client = client;

        this.state = initialReset;
    }

    currentState(): ResetState {
        return this.state;
    }
    updateState(state: ResetState): ResetState {
        this.state = state;
        return this.state;
    }

    reset(content: ResetBoardContent): ResetState {
        if (this.state.state === "try-to-reset") {
            return this.currentState();
        } else {
            return this.updateState(tryToReset(this.delayed(this.requestReset(content))));
        }
    }

    async requestReset(content: ResetBoardContent): Promise<ResetState> {
        const response = await this.client.reset(content.resetToken, content.loginID, content.password);
        if (response.success) {
            return succeedToReset(response.nonce, response.roles);
        } else {
            return failedToReset(response.err);
        }
    }

    async delayed(promise: Promise<ResetState>): Promise<ResetState> {
        try {
            const delayedMarker = { delayed: true }
            const winner = await Promise.race([
                promise,
                new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(delayedMarker);
                    }, RESET_DELAY_LIMIT_SECOND * 1000);
                }),
            ]);

            if (winner === delayedMarker) {
                return delayedToReset(promise);
            }

            return await promise;
        } catch (err) {
            return failedToReset({ type: "infra-error", err });
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
