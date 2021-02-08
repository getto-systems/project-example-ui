import { FormValidationResult, toValidationError } from "../../../../../sub/getto-form/data"
import { LoginIDValidationError, LoginIDInput } from "../data"

export function validateLoginID(loginID: LoginIDInput): FormValidationResult<LoginIDValidationError> {
    const value = loginID.get()
    if (value.length === 0) {
        return EMPTY
    }

    return OK
}

const OK = { valid: true } as const
const EMPTY: FormValidationResult<LoginIDValidationError> = toValidationError(["empty"])
