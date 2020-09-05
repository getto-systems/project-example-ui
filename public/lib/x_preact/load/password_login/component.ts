import { LoginID } from "../../../ability/credential/data";
import { Password } from "../../../ability/password/data";

export interface PreactBaseComponent {
    login: PreactLoginComponent
}

export interface PreactLoginComponent {
    inputLoginID(loginID: LoginID): void
    changeLoginID(): void

    inputPassword(password: Password): void
    changePassword(): void

    showPassword(): void
    hidePassword(): void

    login(): void
}
