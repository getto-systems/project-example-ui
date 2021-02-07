import { FormValidationResult, toValidationError } from "../../../../../sub/getto-form/data"
import { LoginIDFieldError, LoginIDInput } from "../data"

export function validateLoginID(loginID: LoginIDInput): FormValidationResult<LoginIDFieldError> {
    const value = loginID.get()
    if (value.length === 0) {
        return EMPTY
    }

    return OK
}

const OK = { valid: true } as const
const EMPTY: FormValidationResult<LoginIDFieldError> = toValidationError(["empty"])
