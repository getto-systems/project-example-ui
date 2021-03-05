import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../password/authenticate/x_Action/Authenticate/init/worker/message"
import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "../../../../password/reset/checkStatus/x_Action/CheckStatus/init/worker/message"
import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "../../../../password/reset/requestToken/x_Action/RequestToken/init/worker/message"
import {
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "../../../../password/reset/reset/x_Action/Reset/init/worker/message"

export type ForegroundMessage =
    | Readonly<{
          type: "password-authenticate"
          message: AuthenticatePasswordProxyMessage
      }>
    | Readonly<{
          type: "password-reset-requestToken"
          message: RequestPasswordResetTokenProxyMessage
      }>
    | Readonly<{
          type: "password-reset-checkStatus"
          message: CheckPasswordResetSendingStatusProxyMessage
      }>
    | Readonly<{
          type: "password-reset"
          message: ResetPasswordProxyMessage
      }>

export type BackgroundMessage =
    | Readonly<{
          type: "password-authenticate"
          response: AuthenticatePasswordProxyResponse
      }>
    | Readonly<{
          type: "password-reset-requestToken"
          response: RequestPasswordResetTokenProxyResponse
      }>
    | Readonly<{
          type: "password-reset-checkStatus"
          response: CheckPasswordResetSendingStatusProxyResponse
      }>
    | Readonly<{
          type: "password-reset"
          response: ResetPasswordProxyResponse
      }>
    | Readonly<{ type: "error"; err: string }>
