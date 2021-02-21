import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../../../auth/sign/password/authenticate/x_Action/Authenticate/main/worker/message"
import {
    RegisterPasswordProxyMessage,
    RegisterPasswordProxyResponse,
} from "../../../../../../auth/sign/password/resetSession/register/x_Action/Register/main/worker/message"
import {
    StartPasswordResetSessionResourceProxyMessage,
    StartPasswordResetSessionResourceProxyResponse,
} from "../../../../../../auth/sign/password/resetSession/start/x_Action/Start/main/worker/message"

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
          message: RegisterPasswordProxyMessage
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
          response: RegisterPasswordProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
