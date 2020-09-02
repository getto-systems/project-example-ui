import { Password, PasswordValidationError, PasswordCharacter } from "./data";

export interface PasswordAction {
    validatePassword(password: Password): Array<PasswordValidationError>
    checkPasswordCharacter(password: Password): PasswordCharacter
}
