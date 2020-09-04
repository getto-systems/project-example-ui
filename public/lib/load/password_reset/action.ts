import { LoginIDValidator } from "../credential/action";
import { PasswordValidator, PasswordCharacterChecker } from "../password/action";

import { LoginID } from "../credential/data";
import { Password } from "../password/data";
import {
    Session,
    ResetToken,
    CreateSessionBoard, CreateSessionBoardContent, CreateSessionState,
    PollingStatusState,
    ResetBoard, ResetBoardContent, ResetState,
    ValidContent,
} from "./data";

export interface PasswordResetAction {
    initCreateSessionBoardStore(
        loginIDValidator: LoginIDValidator,
    ): CreateSessionBoardStore
    initCreateSessionApi(): CreateSessionApi

    initPollingStatusApi(): PollingStatusApi

    initResetBoardStore(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ): ResetBoardStore
    initResetApi(): ResetApi
}

export interface PasswordResetTransition {
    logined(): void
}

export interface CreateSessionBoardStore {
    currentBoard(): CreateSessionBoard

    inputLoginID(loginID: LoginID): CreateSessionBoard
    changeLoginID(loginID: LoginID): CreateSessionBoard

    content(): ValidContent<CreateSessionBoardContent>
    clearBoard(): void
}
export interface CreateSessionApi {
    currentState(): CreateSessionState
    createSession(content: CreateSessionBoardContent): CreateSessionState
}

export interface PollingStatusApi {
    currentState(): PollingStatusState
    pollingStatus(session: Session): PollingStatusState
}

export interface ResetBoardStore {
    currentBoard(): ResetBoard

    setResetToken(resetToken: ResetToken): ResetBoard

    inputLoginID(loginID: LoginID): ResetBoard
    changeLoginID(loginID: LoginID): ResetBoard

    inputPassword(password: Password): ResetBoard
    changePassword(password: Password): ResetBoard

    showPassword(): ResetBoard
    hidePassword(): ResetBoard

    content(): ValidContent<ResetBoardContent>
    clearBoard(): void
}

export interface ResetApi {
    currentState(): ResetState
    reset(content: ResetBoardContent): ResetState
}
