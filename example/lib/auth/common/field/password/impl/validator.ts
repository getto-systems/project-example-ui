import { FormValidationResult, toValidationError } from "../../../../../sub/getto-form/data"
import { PasswordFieldError, PasswordInput } from "../data"

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72

export function validatePassword(password: PasswordInput): FormValidationResult<PasswordFieldError> {
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
const EMPTY: FormValidationResult<PasswordFieldError> = toValidationError(["empty"])
const TOO_LONG: FormValidationResult<PasswordFieldError> = toValidationError(["too-long"])
