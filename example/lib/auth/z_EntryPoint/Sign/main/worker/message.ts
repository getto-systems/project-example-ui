import {
    AuthenticatePasswordResourceProxyMessage,
    AuthenticatePasswordResourceProxyResponse,
} from "../../../../sign/password/authenticate/x_Action/Authenticate/main/worker/message"
import {
    RegisterPasswordResourceProxyMessage,
    RegisterPasswordResourceProxyResponse,
} from "../../../../x_Resource/Sign/Password/ResetSession/Register/main/worker/message"
import {
    StartPasswordResetSessionResourceProxyMessage,
    StartPasswordResetSessionResourceProxyResponse,
} from "../../../../x_Resource/Sign/Password/ResetSession/Start/main/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthenticatePasswordResourceProxyMessage
      }>
    | Readonly<{
          type: "password-resetSession-start"
          message: StartPasswordResetSessionResourceProxyMessage
      }>
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
          type: "password-resetSession-start"
          response: StartPasswordResetSessionResourceProxyResponse
      }>
    | Readonly<{
          type: "password-resetSession-register"
          response: RegisterPasswordResourceProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
