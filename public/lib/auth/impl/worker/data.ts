import {
    PasswordLoginState,
    PasswordLoginParam,
    PasswordLoginRequest,
} from "../../component/password_login/component"
import {
    PasswordResetSessionState,
    PasswordResetSessionRequest,
} from "../../component/password_reset_session/component"
import {
    PasswordResetParam,
    PasswordResetState,
    PasswordResetRequest,
} from "../../component/password_reset/component"

import { AuthCredential, StoreEvent } from "../../../credential/data"
import { LoginID } from "../../../login_id/data"
import { Password } from "../../../password/data"
import { Content } from "../../../field/data"

export type ForegroundMessage =
    | Readonly<{
          type: "passwordLogin"
          componentID: number
          message: PasswordLoginComponentProxyMessage
      }>
    | Readonly<{
          type: "passwordResetSession"
          componentID: number
          message: PasswordResetSessionComponentProxyMessage
      }>
    | Readonly<{
          type: "passwordReset"
          componentID: number
          message: PasswordResetComponentProxyMessage
      }>
    | Readonly<{
          type: "loginIDField"
          componentID: number
          handlerID: number
          response: LoginIDFieldComponentResponse
      }>
    | Readonly<{
          type: "passwordField"
          componentID: number
          handlerID: number
          response: PasswordFieldComponentResponse
      }>
    | Readonly<{
          type: "credential-store"
          actionID: number
          handlerID: number
          response: StoreActionResponse
      }>

export type BackgroundMessage =
    | Readonly<{ type: "credential-store-init"; actionID: number }>
    | Readonly<{
          type: "credential-store"
          actionID: number
          handlerID: number
          request: StoreActionRequest
      }>
    | Readonly<{
          type: "passwordLogin"
          componentID: number
          response: PasswordLoginComponentProxyResponse
      }>
    | Readonly<{
          type: "passwordResetSession"
          componentID: number
          response: PasswordResetSessionComponentProxyResponse
      }>
    | Readonly<{
          type: "passwordReset"
          componentID: number
          response: PasswordResetComponentProxyResponse
      }>
    | Readonly<{
          type: "loginIDField"
          componentID: number
          handlerID: number
          request: LoginIDFieldComponentRequest
      }>
    | Readonly<{
          type: "passwordField"
          componentID: number
          handlerID: number
          request: PasswordFieldComponentRequest
      }>
    | Readonly<{ type: "error"; err: string }>

export type PasswordLoginComponentProxyMessage =
    | Readonly<{ type: "init"; param: PasswordLoginParam }>
    | Readonly<{ type: "action"; request: PasswordLoginRequest }>

export type PasswordLoginComponentProxyResponse = Readonly<{ type: "post"; state: PasswordLoginState }>

export type PasswordResetSessionComponentProxyMessage =
    | Readonly<{ type: "init" }>
    | Readonly<{ type: "action"; request: PasswordResetSessionRequest }>

export type PasswordResetSessionComponentProxyResponse = Readonly<{
    type: "post"
    state: PasswordResetSessionState
}>

export type PasswordResetComponentProxyMessage =
    | Readonly<{ type: "init"; param: PasswordResetParam }>
    | Readonly<{ type: "action"; request: PasswordResetRequest }>

export type PasswordResetComponentProxyResponse = Readonly<{ type: "post"; state: PasswordResetState }>

export type LoginIDFieldComponentRequest = Readonly<{ type: "validate" }>
export type LoginIDFieldComponentResponse = Readonly<{ type: "content"; content: Content<LoginID> }>

export type PasswordFieldComponentRequest = Readonly<{ type: "validate" }>
export type PasswordFieldComponentResponse = Readonly<{ type: "content"; content: Content<Password> }>

export type StoreActionRequest = AuthCredential
export type StoreActionResponse = StoreEvent