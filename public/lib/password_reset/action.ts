import {
    SessionID,
    ResetToken,
    StartSessionEvent,
    PollingStatusEvent,
    ResetEvent,
    StartSessionFields,
    ResetFields,
} from "./data"
import { Content } from "../field/data"

export interface StartSession {
    (collector: StartSessionCollector): StartSessionAction
}
export interface StartSessionAction {
    (post: Post<StartSessionEvent>): void
}
export interface StartSessionCollector {
    getFields(): Promise<Content<StartSessionFields>>
}

// TODO PollStatus に変更
export interface PollingStatus {
    (): PollingStatusAction
}
export interface PollingStatusAction {
    (sessionID: SessionID, post: Post<PollingStatusEvent>): void
}

export interface Reset {
    (collector: ResetCollector): ResetAction
}
export interface ResetAction {
    (post: Post<ResetEvent>): void
}
export interface ResetCollector {
    getFields(): Promise<Content<ResetFields>>
    getResetToken(): ResetToken
}

interface Post<T> {
    (state: T): void
}
