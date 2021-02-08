import { LoginEvent } from "../../../../login/passwordLogin/event"
import { CheckStatusEvent, ResetEvent, StartSessionEvent } from "../../../../profile/passwordReset/event"

import { LoginFields } from "../../../../login/passwordLogin/data"
import {
    StartSessionFields,
    ResetFields,
    SessionID,
    ResetToken,
} from "../../../../profile/passwordReset/data"
import { Content } from "../../../../common/field/data"
import { FormConvertResult } from "../../../../../sub/getto-form/action/data"

export type ForegroundMessage =
    | Readonly<{ type: "login"; message: ProxyMessage<LoginProxyMessage> }>
    | Readonly<{ type: "startSession"; message: ProxyMessage<StartSessionProxyMessage> }>
    | Readonly<{ type: "checkStatus"; message: ProxyMessage<CheckStatusProxyMessage> }>
    | Readonly<{ type: "reset"; message: ProxyMessage<ResetProxyMessage> }>

export type BackgroundMessage =
    | Readonly<{ type: "login"; response: ProxyResponse<LoginEvent> }>
    | Readonly<{ type: "startSession"; response: ProxyResponse<StartSessionEvent> }>
    | Readonly<{ type: "checkStatus"; response: ProxyResponse<CheckStatusEvent> }>
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
    content: FormConvertResult<LoginFields>
}>
export type StartSessionProxyMessage = Readonly<{
    content: Content<StartSessionFields>
}>
export type CheckStatusProxyMessage = Readonly<{
    sessionID: SessionID
}>
export type ResetProxyMessage = Readonly<{
    resetToken: ResetToken
    content: Content<ResetFields>
}>
