import {
    PasswordLoginActionProxyMessage,
    PasswordLoginActionProxyResponse,
} from "../../../../sign/password/authenticate/main/worker/message"
import {
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse,
} from "../../../../sign/password/resetSession/start/main/worker/message"
import {
    PasswordResetRegisterActionProxyMessage,
    PasswordResetRegisterActionProxyResponse,
} from "../../../../sign/password/resetSession/register/main/worker/message"

export type ForegroundMessage =
    | Readonly<{ type: "login"; message: PasswordLoginActionProxyMessage }>
    | Readonly<{ type: "reset-session"; message: PasswordResetSessionActionProxyMessage }>
    | Readonly<{ type: "reset-register"; message: PasswordResetRegisterActionProxyMessage }>

export type BackgroundMessage =
    | Readonly<{ type: "login"; response: PasswordLoginActionProxyResponse }>
    | Readonly<{ type: "reset-session"; response: PasswordResetSessionActionProxyResponse }>
    | Readonly<{ type: "reset-register"; response: PasswordResetRegisterActionProxyResponse }>
    | Readonly<{ type: "error"; err: string }>
