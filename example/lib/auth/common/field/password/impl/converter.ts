import { FormConvertResult } from "../../../../../sub/getto-form/form/data"
import { markPassword, Password } from "../../../password/data"
import { PasswordInput } from "../data"

export function convertPassword(password: PasswordInput): FormConvertResult<Password> {
    return { success: true, value: markPassword(password.get()) }
}
