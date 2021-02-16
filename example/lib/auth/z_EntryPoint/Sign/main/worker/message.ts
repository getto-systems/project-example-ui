import {
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse,
} from "../../../../sign/password/resetSession/start/main/worker/message"
import {
    AuthSignPasswordAuthenticateProxyMessage,
    AuthSignPasswordAuthenticateProxyResponse,
} from "../../resources/Password/Authenticate/main/worker/message"
import {
    AuthSignPasswordResetSessionRegisterProxyMessage,
    AuthSignPasswordResetSessionRegisterProxyResponse,
} from "../../resources/Password/ResetSession/Register/main/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthSignPasswordAuthenticateProxyMessage
      }>
    | Readonly<{ type: "reset-session"; message: PasswordResetSessionActionProxyMessage }>
    | Readonly<{
          type: "password-resetSession-register"
          message: AuthSignPasswordResetSessionRegisterProxyMessage
      }>

export type BackgroundMessage =
    | Readonly<{
          type: "password-authenticate"
          response: AuthSignPasswordAuthenticateProxyResponse
      }>
    | Readonly<{
          type: "reset-session"
          response: PasswordResetSessionActionProxyResponse
      }>
    | Readonly<{
          type: "password-resetSession-register"
          response: AuthSignPasswordResetSessionRegisterProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
