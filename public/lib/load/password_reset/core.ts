import { LoginID } from "../credential/data";
import { Password } from "../password/data";
import {
    Session,
    ResetToken,
    ResetBoard,
    ResetBoardContent,
    LoginIDBoard,
    validResetBoardContent,
    invalidResetBoardContent,
    CreateSessionState,
    initialCreateSession,
    tryToCreateSession,
    delayedToCreateSession,
    failedToCreateSession,
    succeedToCreateSession,
    PollingStatusState,
    initialPollingStatus,
    tryToPollingStatus,
    failedToPollingStatus,
    succeedToPollingStatus,
    ResetState,
    initialReset,
    tryToReset,
    delayedToReset,
    failedToReset,
    succeedToReset,
} from "./data";
import { Infra, PasswordResetClient, SendTokenError } from "./infra";
import {
    PasswordResetAction,
    LoginIDValidator,
    ResetBoardStore,
    CreateSessionApi,
    PollingStatusApi,
    ResetApi,
} from "./action";

// 「遅くなっています」を表示するまでの秒数
const CREATE_SESSION_DELAY_LIMIT_SECOND = 1;
const RESET_DELAY_LIMIT_SECOND = 1;

export function passwordResetAction(infra: Infra): PasswordResetAction {
    return {
        initResetBoardStore,

        initCreateSessionApi,
        initPollingStatusApi,
        initResetApi,
    }

    function initResetBoardStore(
        loginIDValidator: LoginIDValidator,
    ): ResetBoardStore {
        return new ResetBoardStoreImpl(
            loginIDValidator,
        );
    }

    function initCreateSessionApi(): CreateSessionApi {
        return new CreateSessionApiImpl(infra.passwordResetClient);
    }
    function initPollingStatusApi(): PollingStatusApi {
        return new PollingStatusApiImpl(infra.passwordResetClient);
    }
    function initResetApi(): ResetApi {
        return new ResetApiImpl(infra.passwordResetClient);
    }
}

export type LoginIDBoardSource =
    { loginID: LoginID, board: LoginIDBoard }

class ResetBoardStoreImpl implements ResetBoardStore {
    loginID: LoginIDBoardSource

    loginIDValidator: LoginIDValidator

    constructor(
        loginIDValidator: LoginIDValidator,
    ) {
        this.loginIDValidator = loginIDValidator;

        this.loginID = {
            loginID: { loginID: "" },
            board: { err: [] },
        }
    }

    currentBoard(): ResetBoard {
        return {
            loginID: this.loginID.board,
        }
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

    content(): ResetBoardContent {
        const loginID = this.currentLoginID();

        this.validateLoginID(loginID);

        if (this.loginID.board.err.length > 0) {
            return invalidResetBoardContent;
        }

        return validResetBoardContent(loginID);
    }
    currentLoginID(): LoginID {
        return this.loginID.loginID;
    }

    clear(): ResetBoard {
        this.loginID = {
            loginID: { loginID: "" },
            board: { err: [] },
        }
        return this.currentBoard();
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

    createSession(loginID: LoginID): CreateSessionState {
        if (this.state.state === "try-to-create-session") {
            return this.state;
        }

        this.state = tryToCreateSession(delayed(exec(this.client)));

        return this.state;

        async function exec(client: PasswordResetClient): Promise<CreateSessionState> {
            const response = await client.createSession(loginID);
            if (response.success) {
                return succeedToCreateSession(response.session);
            }
            return failedToCreateSession(response.err);
        }

        async function delayed(promise: Promise<CreateSessionState>): Promise<CreateSessionState> {
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
}

class PollingStatusApiImpl implements PollingStatusApi {
    client: PasswordResetClient

    constructor(client: PasswordResetClient) {
        this.client = client;
    }

    pollingStatus(session: Session): PollingStatusState {
        const POLLING_WAIT_SECOND = 1;

        type SendTokenState =
            Readonly<{ state: "initial" }> |
            Readonly<{ state: "success" }> |
            Readonly<{ state: "failed", err: SendTokenError }>

        let sendTokenState: SendTokenState = { state: "initial" };

        sendToken(this.client);

        return initialPollingStatus(pollingStatus(this.client));

        async function sendToken(client: PasswordResetClient) {
            try {
                const response = await client.sendToken();
                if (response.success) {
                    sendTokenState = { state: "success" }
                } else {
                    sendTokenState = { state: "failed", err: response.err }
                }
            } catch (err) {
                sendTokenState = { state: "failed", err: { type: "infra-error", err } }
            }
        }

        async function pollingStatus(client: PasswordResetClient): Promise<PollingStatusState> {
            if (sendTokenState.state === "failed") {
                return failedToPollingStatus(sendTokenState.err);
            }

            try {
                const response = await client.getStatus(session);

                switch (response.state) {
                    case "polling":
                        return tryToPollingStatus(
                            response.dest,
                            response.status,
                            new Promise((resolve, reject) => {
                                setTimeout(() => {
                                    pollingStatus(client).then(resolve).catch(reject);
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

    reset(resetToken: ResetToken, loginID: LoginID, password: Password): ResetState {
        if (this.state.state === "try-to-reset") {
            return this.state;
        }

        this.state = tryToReset(delayed(exec(this.client)));

        return this.state;

        async function exec(client: PasswordResetClient): Promise<ResetState> {
            const response = await client.reset(resetToken, loginID, password);
            if (response.success) {
                return succeedToReset(response.nonce, response.roles);
            }
            return failedToReset(response.err);
        }

        async function delayed(promise: Promise<ResetState>): Promise<ResetState> {
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
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
