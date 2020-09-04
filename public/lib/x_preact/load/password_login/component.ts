import { LoginID } from "../../../action/credential/data";
import { Password } from "../../../action/password/data";

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
