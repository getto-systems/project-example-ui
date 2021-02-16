import {
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse,
} from "../../../../sign/password/resetSession/start/main/worker/message"
import {
    PasswordResetRegisterActionProxyMessage,
    PasswordResetRegisterActionProxyResponse,
} from "../../../../sign/password/resetSession/register/main/worker/message"
import {
    AuthSignPasswordAuthenticateProxyMessage,
    AuthSignPasswordAuthenticateProxyResponse,
} from "../../resources/Password/Authenticate/main/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthSignPasswordAuthenticateProxyMessage
      }>
    | Readonly<{ type: "reset-session"; message: PasswordResetSessionActionProxyMessage }>
    | Readonly<{
          type: "reset-register"
          message: PasswordResetRegisterActionProxyMessage
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
          type: "reset-register"
          response: PasswordResetRegisterActionProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
