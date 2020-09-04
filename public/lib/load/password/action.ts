import { Password, PasswordValidationError, PasswordCharacter } from "./data";

export interface PasswordAction {
    validatePassword(password: Password): Array<PasswordValidationError>
    checkPasswordCharacter(password: Password): PasswordCharacter
}

export interface PasswordValidator {
    (password: Password): Array<PasswordValidationError>
}
export interface PasswordCharacterChecker {
    (password: Password): PasswordCharacter
}
