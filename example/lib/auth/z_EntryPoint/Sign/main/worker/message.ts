import {
    PasswordResetSessionActionProxyMessage,
    PasswordResetSessionActionProxyResponse,
} from "../../../../sign/password/resetSession/start/main/worker/message"
import {
    AuthenticatePasswordResourceProxyMessage,
    AuthenticatePasswordResourceProxyResponse,
} from "../../../../x_Resource/Sign/Password/Authenticate/main/worker/message"
import {
    RegisterPasswordResourceProxyMessage,
    RegisterPasswordResourceProxyResponse,
} from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthenticatePasswordResourceProxyMessage
      }>
    | Readonly<{ type: "reset-session"; message: PasswordResetSessionActionProxyMessage }>
    | Readonly<{
          type: "password-resetSession-register"
          message: RegisterPasswordResourceProxyMessage
      }>

export type BackgroundMessage =
    | Readonly<{
          type: "password-authenticate"
          response: AuthenticatePasswordResourceProxyResponse
      }>
    | Readonly<{
          type: "reset-session"
          response: PasswordResetSessionActionProxyResponse
      }>
    | Readonly<{
          type: "password-resetSession-register"
          response: RegisterPasswordResourceProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
