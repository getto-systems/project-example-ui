import { PasswordLoginLocationInfo } from "../passwordLogin/resource"
import { PasswordResetLocationInfo } from "../passwordReset/resource"
import { RenewCredentialLocationInfo } from "../renewCredential/resource"

export type LoginLocationInfo = RenewCredentialLocationInfo &
    PasswordLoginLocationInfo &
    PasswordResetLocationInfo
