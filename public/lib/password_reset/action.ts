import {
    SessionID, ResetToken,
    StartSessionEvent, PollingStatusEvent,
    ResetEvent,
} from "./data"
import { LoginID } from "../login_id/data"
import { Password } from "../password/data"
import { Content } from "../field/data"

export interface StartSessionAction {
    (post: Post<StartSessionEvent>): void
}

export interface StartSessionFieldCollector {
    loginID(): Promise<Content<LoginID>>
}

export interface PollingStatusAction {
    (sessionID: SessionID, post: Post<PollingStatusEvent>): void
}

export interface ResetAction {
    (resetToken: ResetToken, post: Post<ResetEvent>): void
}

export interface ResetFieldCollector {
    loginID(): Promise<Content<LoginID>>
    password(): Promise<Content<Password>>
}

interface Post<T> {
    (state: T): void
}
