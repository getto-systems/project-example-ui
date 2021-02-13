import { FormValidationResult, toValidationError } from "../../../../getto-form/form/data"
import { PasswordValidationError, PasswordInput } from "../data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

export function validatePassword(password: PasswordInput): FormValidationResult<PasswordValidationError> {
    const value = password.get()
    if (value.length === 0) {
        return EMPTY
    }

    if (new TextEncoder().encode(value).byteLength > PASSWORD_MAX_BYTES) {
        return TOO_LONG
    }

    return OK
}

const OK = { valid: true } as const
const EMPTY: FormValidationResult<PasswordValidationError> = toValidationError(["empty"])
const TOO_LONG: FormValidationResult<PasswordValidationError> = toValidationError(["too-long"])
