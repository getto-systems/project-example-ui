import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/message"
import {
    RegisterPasswordResourceProxyMessage,
    RegisterPasswordResourceProxyResponse,
} from "../../../../../../auth/x_Resource/Sign/Password/ResetSession/Register/main/worker/message"
import {
    StartPasswordResetSessionResourceProxyMessage,
    StartPasswordResetSessionResourceProxyResponse,
} from "../../../../../../auth/x_Resource/Sign/Password/ResetSession/Start/main/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthenticatePasswordProxyMessage
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
          response: AuthenticatePasswordProxyResponse
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
