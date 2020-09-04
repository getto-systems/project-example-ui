import { LoginIDValidator } from "../credential/action";
import { PasswordValidator, PasswordCharacterChecker } from "../password/action";

import { LoginID } from "../credential/data";
import { Password } from "../password/data";
import { LoginBoard, LoginBoardContent, LoginState } from "./data";

export interface PasswordLoginAction {
    initLoginBoardStore(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ): LoginBoardStore

    initLoginApi(): LoginApi
}

export interface PasswordLoginTransition {
    logined(): void
}

export interface LoginBoardStore {
    currentBoard(): LoginBoard

    inputLoginID(loginID: LoginID): LoginBoard
    changeLoginID(loginID: LoginID): LoginBoard

    inputPassword(password: Password): LoginBoard
    changePassword(password: Password): LoginBoard

    showPassword(): LoginBoard
    hidePassword(): LoginBoard

    content(): LoginBoardContent
    clear(): LoginBoard
}

export interface LoginApi {
    currentState(): LoginState
    login(loginID: LoginID, password: Password): LoginState
}
