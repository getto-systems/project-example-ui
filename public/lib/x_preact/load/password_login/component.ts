import { LoginID } from "../../../wand/credential/data";
import { Password } from "../../../wand/password/data";

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
