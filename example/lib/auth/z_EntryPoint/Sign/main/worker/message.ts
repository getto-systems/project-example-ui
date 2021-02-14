import {
    LoginActionProxyMessage,
    LoginActionProxyResponse,
} from "../../../../sign/password/login/worker/message"
import {
    SessionActionProxyMessage,
    SessionActionProxyResponse,
} from "../../../../sign/password/reset/session/worker/message"
import {
    RegisterActionProxyMessage,
    RegisterActionProxyResponse,
} from "../../../../sign/password/reset/register/worker/message"

export type ForegroundMessage =
    | Readonly<{ type: "login"; message: LoginActionProxyMessage }>
    | Readonly<{ type: "reset-session"; message: SessionActionProxyMessage }>
    | Readonly<{ type: "reset-register"; message: RegisterActionProxyMessage }>

export type BackgroundMessage =
    | Readonly<{ type: "login"; response: LoginActionProxyResponse }>
    | Readonly<{ type: "reset-session"; response: SessionActionProxyResponse }>
    | Readonly<{ type: "reset-register"; response: RegisterActionProxyResponse }>
    | Readonly<{ type: "error"; err: string }>
