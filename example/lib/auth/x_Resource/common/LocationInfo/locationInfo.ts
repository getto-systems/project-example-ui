import { PasswordLoginLocationInfo } from "../../Sign/PasswordLogin/resource"
import { PasswordResetLocationInfo } from "../../Profile/PasswordReset/resource"
import { RenewCredentialLocationInfo } from "../../Sign/RenewCredential/resource"

export type LoginLocationInfo = RenewCredentialLocationInfo &
    PasswordLoginLocationInfo &
    PasswordResetLocationInfo
