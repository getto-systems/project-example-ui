import {
    AuthenticatePasswordProxyMessage,
    AuthenticatePasswordProxyResponse,
} from "../../../../password/authenticate/Action/init/worker/message"
import {
    CheckPasswordResetSendingStatusProxyMessage,
    CheckPasswordResetSendingStatusProxyResponse,
} from "../../../../password/reset/checkStatus/Action/init/worker/message"
import {
    RequestPasswordResetTokenProxyMessage,
    RequestPasswordResetTokenProxyResponse,
} from "../../../../password/reset/requestToken/Action/init/worker/message"
import {
    ResetPasswordProxyMessage,
    ResetPasswordProxyResponse,
} from "../../../../password/reset/reset/Action/init/worker/message"

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
