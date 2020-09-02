import { LoginID, LoginIDValidationError } from "../credential/data";
import { Password } from "../password/data";
import {
    ResetBoard,
    ResetBoardContent,
    Session,
    ResetToken,
    CreateSessionState,
    PollingStatusState,
    ResetState,
} from "./data";

export interface PasswordResetAction {
    initResetBoardStore(
        loginIDValidator: LoginIDValidator,
    ): ResetBoardStore

    initCreateSessionApi(): CreateSessionApi
    initPollingStatusApi(): PollingStatusApi
    initResetApi(): ResetApi
}

export interface PasswordResetTransition {
    logined(): void
}

export interface LoginIDValidator {
    (loginID: LoginID): Array<LoginIDValidationError>
}

export interface ResetBoardStore {
    currentBoard(): ResetBoard

    inputLoginID(loginID: LoginID): ResetBoard
    changeLoginID(loginID: LoginID): ResetBoard

    content(): ResetBoardContent
    clear(): ResetBoard
}

export interface CreateSessionApi {
    currentState(): CreateSessionState
    createSession(loginID: LoginID): CreateSessionState
}

export interface PollingStatusApi {
    pollingStatus(session: Session): PollingStatusState
}

export interface ResetApi {
    currentState(): ResetState
    reset(resetToken: ResetToken, loginID: LoginID, password: Password): ResetState
}
