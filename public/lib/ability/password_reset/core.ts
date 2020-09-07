import { Infra, PasswordResetClient, SendTokenError } from "./infra";

import { LoginIDRecord } from "../auth_credential/action";
import { PasswordRecord } from "../password/action";
import {
    ResetTokenRecord,
    PasswordResetAction,
    CreateSessionStore, CreateSessionApi,
    PollingStatusApi,
    ResetStore, ResetApi,
} from "./action";

import { LoginIDBoard } from "../auth_credential/data";
import { PasswordBoard } from "../password/data";
import {
    Session,
    ResetToken, ResetTokenBoard, ResetTokenValidationError, ValidResetToken,

    CreateSessionBoard, CreateSessionContent,
    CreateSessionState, initialCreateSession, tryToCreateSession, delayedToCreateSession, failedToCreateSession, succeedToCreateSession,

    PollingStatusState, initialPollingStatus, tryToPollingStatus, retryToPollingStatus, failedToPollingStatus, succeedToPollingStatus,

    ResetBoard, ResetContent,
    ResetState, initialReset, tryToReset, delayedToReset, failedToReset, succeedToReset,

    ValidContent, validContent, invalidContent,
} from "./data";

// 「遅くなっています」を表示するまでの秒数
const CREATE_SESSION_DELAY_LIMIT_SECOND = 1;
const RESET_DELAY_LIMIT_SECOND = 1;

export function initPasswordResetAction(infra: Infra): PasswordResetAction {
    return new PasswordResetActionImpl(infra);
}

class PasswordResetActionImpl implements PasswordResetAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    initResetTokenRecord(): ResetTokenRecord {
        return new ResetTokenRecordImpl();
    }

    initCreateSessionStore(loginID: LoginIDRecord): CreateSessionStore {
        return new CreateSessionStoreImpl(loginID);
    }
    initCreateSessionApi(): CreateSessionApi {
        return new CreateSessionApiImpl(this.infra.passwordResetClient);
    }

    initPollingStatusApi(): PollingStatusApi {
        return new PollingStatusApiImpl(this.infra.passwordResetClient);
    }

    initResetStore(resetToken: ResetTokenRecord, loginID: LoginIDRecord, password: PasswordRecord): ResetStore {
        return new ResetStoreImpl(resetToken, loginID, password);
    }
    initResetApi(): ResetApi {
        return new ResetApiImpl(this.infra.passwordResetClient);
    }
}

class CreateSessionStoreImpl implements CreateSessionStore {
    impl: {
        loginID: LoginIDRecord
    }

    constructor(loginID: LoginIDRecord) {
        this.impl = { loginID }
    }

    loginID(): LoginIDRecord {
        return this.impl.loginID;
    }

    currentBoard(): CreateSessionBoard {
        return [this.loginID().currentBoard()];
    }

    mapLoginID(loginIDBoard: LoginIDBoard): CreateSessionBoard {
        return [loginIDBoard];
    }

    content(): ValidContent<CreateSessionContent> {
        const loginID = this.loginID().validate();
        if (!loginID.valid) {
            return invalidContent();
        }

        return validContent([loginID.content]);
    }

    clear(): CreateSessionBoard {
        this.loginID().clear();
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

    updateState(state: CreateSessionState): CreateSessionState {
        this.state = state;
        return this.state;
    }

    createSession(content: CreateSessionContent): CreateSessionState {
        if (this.state.state === "try-to-create-session") {
            return this.currentState();
        } else {
            return this.updateState(tryToCreateSession(this.delayed(this.requestCreateSession(content))));
        }
    }

    async requestCreateSession(content: CreateSessionContent): Promise<CreateSessionState> {
        const response = await this.client.createSession(...content);
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

const EMPTY_RESET_TOKEN: ResetToken = { token: "" }
const ERROR: {
    ok: Array<ResetTokenValidationError>,
    empty: Array<ResetTokenValidationError>,
} = {
    ok: [],
    empty: ["empty"],
}

class ResetTokenRecordImpl implements ResetTokenRecord {
    resetToken: ResetToken = EMPTY_RESET_TOKEN
    err: Array<ResetTokenValidationError> = ERROR.ok

    currentBoard(): ResetTokenBoard {
        return {
            err: this.err,
        }
    }

    set(resetToken: ResetToken): ResetTokenBoard {
        this.resetToken = resetToken;
        this.err = validateResetToken(this.resetToken);
        return this.currentBoard();
    }

    validate(): ValidResetToken {
        this.err = validateResetToken(this.resetToken);
        if (this.err.length > 0) {
            return { valid: false }
        } else {
            return { valid: true, content: this.resetToken }
        }
    }

    clear(): void {
        this.resetToken = EMPTY_RESET_TOKEN;
        this.err = ERROR.ok;
    }
}

function validateResetToken(resetToken: ResetToken): Array<ResetTokenValidationError> {
    if (resetToken.token.length === 0) {
        return ERROR.empty;
    }

    return ERROR.ok;
}

class ResetStoreImpl implements ResetStore {
    impl: {
        resetToken: ResetTokenRecord
        loginID: LoginIDRecord
        password: PasswordRecord
    }

    constructor(resetToken: ResetTokenRecord, loginID: LoginIDRecord, password: PasswordRecord) {
        this.impl = { resetToken, loginID, password }
    }

    resetToken(): ResetTokenRecord {
        return this.impl.resetToken;
    }
    loginID(): LoginIDRecord {
        return this.impl.loginID;
    }
    password(): PasswordRecord {
        return this.impl.password;
    }

    currentBoard(): ResetBoard {
        return [
            this.resetToken().currentBoard(),
            this.loginID().currentBoard(),
            this.password().currentBoard(),
        ]
    }

    mapResetToken(resetTokenBoard: ResetTokenBoard): ResetBoard {
        return [resetTokenBoard, this.loginID().currentBoard(), this.password().currentBoard()]
    }
    mapLoginID(loginIDBoard: LoginIDBoard): ResetBoard {
        return [this.resetToken().currentBoard(), loginIDBoard, this.password().currentBoard()]
    }
    mapPassword(passwordBoard: PasswordBoard): ResetBoard {
        return [this.resetToken().currentBoard(), this.loginID().currentBoard(), passwordBoard]
    }

    content(): ValidContent<ResetContent> {
        const resetToken = this.resetToken().validate();
        if (!resetToken.valid) {
            return invalidContent();
        }

        const loginID = this.loginID().validate();
        if (!loginID.valid) {
            return invalidContent();
        }

        const password = this.password().validate();
        if (!password.valid) {
            return invalidContent();
        }

        return validContent([resetToken.content, loginID.content, password.content]);
    }

    clear(): ResetBoard {
        this.resetToken().clear();
        this.loginID().clear();
        this.password().clear();
        return this.currentBoard();
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

    reset(content: ResetContent): ResetState {
        if (this.state.state === "try-to-reset") {
            return this.currentState();
        } else {
            return this.updateState(tryToReset(this.delayed(this.requestReset(content))));
        }
    }

    async requestReset(content: ResetContent): Promise<ResetState> {
        const response = await this.client.reset(...content);
        if (response.success) {
            return succeedToReset(response.authCredential);
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
