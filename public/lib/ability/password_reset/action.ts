import { LoginIDRecord } from "../auth_credential/action";
import { PasswordRecord } from "../password/action";

import { LoginIDBoard } from "../auth_credential/data";
import { PasswordBoard } from "../password/data";
import {
    Session,
    ResetToken, ResetTokenBoard, ValidResetToken,
    CreateSessionBoard, CreateSessionContent, CreateSessionState,
    PollingStatusState,
    ResetBoard, ResetContent, ResetState,
    ValidContent,
} from "./data";

export interface PasswordResetAction {
    initResetTokenRecord(): ResetTokenRecord

    initCreateSessionStore(loginID: LoginIDRecord): CreateSessionStore
    initCreateSessionApi(): CreateSessionApi

    initPollingStatusApi(): PollingStatusApi

    initResetStore(resetToken: ResetTokenRecord, loginID: LoginIDRecord, password: PasswordRecord): ResetStore
    initResetApi(): ResetApi
}

export interface PasswordResetTransition {
    logined(): void
}

export interface CreateSessionStore {
    loginID(): LoginIDRecord

    currentBoard(): CreateSessionBoard

    mapLoginID(loginID: LoginIDBoard): CreateSessionBoard

    content(): ValidContent<CreateSessionContent>
    clear(): CreateSessionBoard
}
export interface CreateSessionApi {
    currentState(): CreateSessionState
    createSession(content: CreateSessionContent): CreateSessionState
}

export interface PollingStatusApi {
    currentState(): PollingStatusState
    pollingStatus(session: Session): PollingStatusState
}

export interface ResetTokenRecord {
    currentBoard(): ResetTokenBoard

    set(resetToken: ResetToken): ResetTokenBoard

    validate(): ValidResetToken
    clear(): void
}

export interface ResetStore {
    resetToken(): ResetTokenRecord
    loginID(): LoginIDRecord
    password(): PasswordRecord

    currentBoard(): ResetBoard

    mapResetToken(resetToken: ResetTokenBoard): ResetBoard
    mapLoginID(loginID: LoginIDBoard): ResetBoard
    mapPassword(password: PasswordBoard): ResetBoard

    content(): ValidContent<ResetContent>
    clear(): ResetBoard
}

export interface ResetApi {
    currentState(): ResetState
    reset(content: ResetContent): ResetState
}
