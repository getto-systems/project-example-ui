import { LoginEvent, LoginFields } from "../../../password_login/data"
import {
    StartSessionFields,
    ResetFields,
    StartSessionEvent,
    PollingStatusEvent,
    ResetEvent,
    SessionID,
    ResetToken,
} from "../../../password_reset/data"
import { Content } from "../../../field/data"

export type ForegroundMessage =
    | Readonly<{ type: "login"; message: ProxyMessage<LoginProxyMessage> }>
    | Readonly<{ type: "startSession"; message: ProxyMessage<StartSessionProxyMessage> }>
    | Readonly<{ type: "pollingStatus"; message: ProxyMessage<PollingStatusProxyMessage> }>
    | Readonly<{ type: "reset"; message: ProxyMessage<ResetProxyMessage> }>

export type BackgroundMessage =
    | Readonly<{ type: "login"; response: ProxyResponse<LoginEvent> }>
    | Readonly<{ type: "startSession"; response: ProxyResponse<StartSessionEvent> }>
    | Readonly<{ type: "pollingStatus"; response: ProxyResponse<PollingStatusEvent> }>
    | Readonly<{ type: "reset"; response: ProxyResponse<ResetEvent> }>
    | Readonly<{ type: "error"; err: string }>

export type ProxyMessage<T> = Readonly<{
    handlerID: number
    message: T
}>
export type ProxyResponse<T> = Readonly<{
    handlerID: number
    done: boolean
    response: T
}>

export type LoginProxyMessage = Readonly<{
    content: Content<LoginFields>
}>
export type StartSessionProxyMessage = Readonly<{
    content: Content<StartSessionFields>
}>
export type PollingStatusProxyMessage = Readonly<{
    sessionID: SessionID
}>
export type ResetProxyMessage = Readonly<{
    resetToken: ResetToken
    content: Content<ResetFields>
}>
