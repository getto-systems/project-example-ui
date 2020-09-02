import { PasswordAction } from "./action";
import { Password, PasswordValidationError, PasswordCharacter, simplePassword, complexPassword } from "./data";

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_LENGTH = 72;

export function passwordAction(): PasswordAction {
    return {
        validatePassword,
        checkPasswordCharacter,
    }

    function validatePassword(password: Password): Array<PasswordValidationError> {
        const errors: Array<PasswordValidationError> = []

        if (password.password.length === 0) {
            errors.push("empty");
        }

        if (Buffer.byteLength(password.password, 'utf8') > PASSWORD_MAX_LENGTH) {
            errors.push("too-long");
        }

        return errors;
    }

    function checkPasswordCharacter(password: Password): PasswordCharacter {
        for (let i = 0; i < password.password.length; i++) {
            if (password.password.charCodeAt(i) >= 128) {
                return complexPassword;
            }
        }
        return simplePassword;
    }
}
