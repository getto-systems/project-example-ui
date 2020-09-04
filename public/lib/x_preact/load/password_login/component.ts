import { LoginID } from "../../../load/credential/data";
import { Password } from "../../../load/password/data";

export interface PasswordLoginPreactComponent {
    inputLoginID(loginID: LoginID): void
    changeLoginID(loginID: LoginID): void

    inputPassword(password: Password): void
    changePassword(password: Password): void

    showPassword(): void
    hidePassword(): void

    login(): void
}
