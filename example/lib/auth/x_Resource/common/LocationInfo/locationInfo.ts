import { PasswordLoginLocationInfo } from "../../Login/PasswordLogin/resource"
import { PasswordResetLocationInfo } from "../../Profile/PasswordReset/resource"
import { RenewCredentialLocationInfo } from "../../Login/RenewCredential/resource"

export type LoginLocationInfo = RenewCredentialLocationInfo &
    PasswordLoginLocationInfo &
    PasswordResetLocationInfo
