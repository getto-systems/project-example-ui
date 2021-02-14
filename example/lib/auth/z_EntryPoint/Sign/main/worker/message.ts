import {
    LoginActionProxyMessage,
    LoginActionProxyResponse,
} from "../../../../sign/password/login/worker/message"

import {
    CheckStatusEvent,
    ResetEvent,
    StartSessionEvent,
} from "../../../../sign/password/reset/register/event"

import { LoginFields } from "../../../../sign/password/login/data"
import {
    StartSessionFields,
    ResetFields,
    SessionID,
    ResetToken,
} from "../../../../sign/password/reset/register/data"
import { FormConvertResult } from "../../../../../common/getto-form/form/data"

export type ForegroundMessage =
    | Readonly<{ type: "login"; action: LoginActionProxyMessage }>
    | Readonly<{ type: "startSession"; message: ProxyMessage<StartSessionProxyMessage> }>
    | Readonly<{ type: "checkStatus"; message: ProxyMessage<CheckStatusProxyMessage> }>
    | Readonly<{ type: "reset"; message: ProxyMessage<ResetProxyMessage> }>

export type BackgroundMessage =
    | Readonly<{ type: "login"; action: LoginActionProxyResponse }>
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
    fields: FormConvertResult<LoginFields>
}>
export type StartSessionProxyMessage = Readonly<{
    fields: FormConvertResult<StartSessionFields>
}>
export type CheckStatusProxyMessage = Readonly<{
    sessionID: SessionID
}>
export type ResetProxyMessage = Readonly<{
    resetToken: ResetToken
    fields: FormConvertResult<ResetFields>
}>
