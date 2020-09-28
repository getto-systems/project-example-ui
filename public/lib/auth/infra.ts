import { AuthState } from "./usecase"

import { RenewCredentialParamPacker } from "./component/renew_credential/component"
import { LoadApplicationParamPacker } from "./component/load_application/component"
import { PasswordResetParamPacker } from "./component/password_reset/component"

import { PagePathname } from "../script/data"

export type Infra = Readonly<{
    param: AuthParam
    authLocation: AuthLocation
}>

export type AuthParam = Readonly<{
    renewCredential: RenewCredentialParamPacker
    loadApplication: LoadApplicationParamPacker
    passwordReset: PasswordResetParamPacker
}>

export interface AuthLocation {
    detect(param: AuthParam): AuthState
    currentPagePathname(): PagePathname
}
