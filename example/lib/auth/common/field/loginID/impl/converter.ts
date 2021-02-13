import { FormConvertResult } from "../../../../../common/getto-form/form/data"
import { LoginID, markLoginID } from "../../../loginID/data"
import { LoginIDInput } from "../data"

export function convertLoginID(loginID: LoginIDInput): FormConvertResult<LoginID> {
    return { success: true, value: markLoginID(loginID.get()) }
}
