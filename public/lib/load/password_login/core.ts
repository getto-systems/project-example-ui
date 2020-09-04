import { Infra, PasswordLoginClient } from "./infra";

import { LoginIDValidator } from "../credential/action";
import { PasswordValidator, PasswordCharacterChecker } from "../password/action";
import { PasswordLoginAction, LoginBoardStore, LoginApi } from "./action";

import { LoginID, LoginIDBoard } from "../credential/data";
import {
    Password,
    PasswordBoard,
    PasswordView, showPassword, hidePassword, updatePasswordView,
} from "../password/data";
import {
    LoginBoard,
    LoginBoardContent, invalidLoginBoardContent, validLoginBoardContent,
    LoginState, initialLogin, tryToLogin, delayedToLogin, failedToLogin, succeedToLogin,
} from "./data";

export function passwordLoginAction(infra: Infra): PasswordLoginAction {
    return {
        initLoginBoardStore,
        initLoginApi,
    }

    function initLoginBoardStore(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ): LoginBoardStore {
        return new LoginBoardStoreImpl(
            loginIDValidator,
            passwordValidator,
            passwordCharacterChekcer,
        );
    }

    function initLoginApi(): LoginApi {
        return new LoginApiImpl(infra.passwordLoginClient);
    }
}

export type LoginIDBoardSource =
    { loginID: LoginID, board: LoginIDBoard }

export type PasswordBoardSource =
    { password: Password, board: PasswordBoard }

class LoginBoardStoreImpl implements LoginBoardStore {
    loginID: LoginIDBoardSource
    password: PasswordBoardSource

    loginIDValidator: LoginIDValidator
    passwordValidator: PasswordValidator
    passwordCharacterChekcer: PasswordCharacterChecker

    constructor(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ) {
        this.loginIDValidator = loginIDValidator;
        this.passwordValidator = passwordValidator;
        this.passwordCharacterChekcer = passwordCharacterChekcer;

        this.loginID = {
            loginID: { loginID: "" },
            board: { err: [] },
        }
        this.password = {
            password: { password: "" },
            board: {
                character: { complex: false },
                view: { show: false },
                err: [],
            },
        }
    }

    currentBoard(): LoginBoard {
        return {
            loginID: this.loginID.board,
            password: this.password.board,
        }
    }

    inputLoginID(loginID: LoginID): LoginBoard {
        return this.updateLoginID(loginID);
    }
    changeLoginID(loginID: LoginID): LoginBoard {
        return this.updateLoginID(loginID);
    }
    updateLoginID(loginID: LoginID): LoginBoard {
        this.loginID.loginID = loginID;
        this.loginID.board = { err: this.loginIDValidator(loginID) };
        return this.currentBoard();
    }
    validateLoginID(loginID: LoginID): void {
        this.loginID.board = { err: this.loginIDValidator(loginID) };
    }

    inputPassword(password: Password): LoginBoard {
        return this.updatePassword(password);
    }
    changePassword(password: Password): LoginBoard {
        return this.updatePassword(password);
    }
    updatePassword(password: Password): LoginBoard {
        this.password.password = password;
        this.password.board = {
            character: this.passwordCharacterChekcer(password),
            view: updatePasswordView(this.password.board.view, password),
            err: this.passwordValidator(password),
        }
        return this.currentBoard();
    }
    validatePassword(password: Password): void {
        this.password.board = {
            character: this.password.board.character,
            view: this.password.board.view,
            err: this.passwordValidator(password),
        }
    }

    showPassword(): LoginBoard {
        this.updatePasswordView(showPassword(this.currentPassword()));
        return this.currentBoard();
    }
    hidePassword(): LoginBoard {
        this.updatePasswordView(hidePassword);
        return this.currentBoard();
    }
    updatePasswordView(view: PasswordView): void {
        this.password.board = { character: this.password.board.character, view, err: this.password.board.err };
    }

    content(): LoginBoardContent {
        const loginID = this.currentLoginID();
        const password = this.currentPassword();

        this.validateLoginID(loginID);
        this.validatePassword(password);

        if (
            this.loginID.board.err.length > 0 ||
            this.password.board.err.length > 0
        ) {
            return invalidLoginBoardContent;
        }

        return validLoginBoardContent(loginID, password);
    }
    currentLoginID(): LoginID {
        return this.loginID.loginID;
    }
    currentPassword(): Password {
        return this.password.password;
    }

    clear(): LoginBoard {
        this.loginID = {
            loginID: { loginID: "" },
            board: { err: [] },
        }
        this.password = {
            password: { password: "" },
            board: {
                character: { complex: false },
                view: { show: false },
                err: [],
            },
        }
        return this.currentBoard();
    }
}

/* TODO undo, redo が必要なやつの土台として使える、かも
class LoginBoardStoreImpl implements LoginBoardStore {
    boards: Array<BoardSource>

    loginIDValidator: LoginIDValidator
    passwordValidator: PasswordValidator
    passwordCharacterChekcer: PasswordCharacterChecker

    constructor(
        loginIDValidator: LoginIDValidator,
        passwordValidator: PasswordValidator,
        passwordCharacterChekcer: PasswordCharacterChecker,
    ) {
        this.loginIDValidator = loginIDValidator;
        this.passwordValidator = passwordValidator;
        this.passwordCharacterChekcer = passwordCharacterChekcer;

        this.boards = [];
        this.pushNewBoardSource();
    }

    currentBoard(): LoginBoard {
        return {
            loginID: this.currentBoardSource().loginID.board,
            password: this.currentBoardSource().password.board,
        }
    }

    inputLoginID(loginID: LoginID): LoginBoard {
        this.updateLoginID(loginID);
        return this.currentBoard();
    }
    changeLoginID(loginID: LoginID): LoginBoard {
        this.updateLoginID(loginID);
        this.pushNewBoardSource();
        return this.currentBoard();
    }
    updateLoginID(loginID: LoginID): void {
        const source = this.currentBoardSource().loginID;
        source.loginID = loginID;
        source.board = { err: this.loginIDValidator(loginID) };
    }
    validateLoginID(loginID: LoginID): void {
        this.currentBoardSource().loginID.board = { err: this.loginIDValidator(loginID) };
    }

    inputPassword(password: Password): LoginBoard {
        this.updatePassword(password);
        return this.currentBoard();
    }
    changePassword(password: Password): LoginBoard {
        this.updatePassword(password);
        this.pushNewBoardSource();
        return this.currentBoard();
    }
    updatePassword(password: Password): void {
        const source = this.currentBoardSource().password;
        source.password = password;
        source.board = {
            character: this.passwordCharacterChekcer(password),
            view: updatePasswordView(source.board.view, password),
            err: this.passwordValidator(password),
        }
    }
    validatePassword(password: Password): void {
        const source = this.currentBoardSource().password;
        source.board = {
            character: source.board.character,
            view: source.board.view,
            err: this.passwordValidator(password),
        }
    }

    showPassword(): LoginBoard {
        this.updatePasswordView(showPassword(this.currentPassword()));
        return this.currentBoard();
    }
    hidePassword(): LoginBoard {
        this.updatePasswordView(hidePassword);
        return this.currentBoard();
    }
    updatePasswordView(view: PasswordView): void {
        const source = this.currentBoardSource().password;
        source.board = { character: source.board.character, view, err: source.board.err };
    }

    content(): LoginBoardContent {
        const loginID = this.currentLoginID();
        const password = this.currentPassword();

        this.validateLoginID(loginID);
        this.validatePassword(password);

        if (
            this.currentBoardSource().loginID.board.err.length > 0 ||
            this.currentBoardSource().password.board.err.length > 0
        ) {
            return invalidBoardContent;
        }

        return validBoardContent(loginID, password);
    }
    currentLoginID(): LoginID {
        for (let i = this.boards.length - 1; i >= 0; i--) {
            const source = this.boards[i];
            if (source.loginID.loginID.loginID !== "") {
                return source.loginID.loginID;
            }
        }
        return { loginID: "" };
    }
    currentPassword(): Password {
        for (let i = this.boards.length - 1; i >= 0; i--) {
            const source = this.boards[i];
            if (source.password.password.password !== "") {
                return source.password.password;
            }
        }
        return { password: "" };
    }

    clear(): LoginBoard {
        this.boards = [];
        this.pushNewBoardSource();
        return this.currentBoard();
    }

    currentBoardSource(): BoardSource {
        return this.boards[this.boards.length - 1];
    }

    pushNewBoardSource(): void {
        if (this.boards.length === 0) {
            this.boards.push({
                loginID: {
                    loginID: { loginID: "" },
                    board: { err: [] },
                },
                password: {
                    password: { password: "" },
                    board: {
                        character: { complex: false },
                        view: { show: false },
                        err: [],
                    },
                },
            });
        } else {
            const current = this.currentBoardSource();
            this.boards.push({
                loginID: {
                    loginID: { loginID: "" },
                    board: current.loginID.board,
                },
                password: {
                    password: { password: "" },
                    board: current.password.board,
                },
            });
        }
    }
}
*/

const LOGIN_DELAY_LIMIT_SECOND = 1;

class LoginApiImpl implements LoginApi {
    client: PasswordLoginClient

    state: LoginState

    constructor(client: PasswordLoginClient) {
        this.client = client;
        this.state = initialLogin;
    }

    currentState(): LoginState {
        return this.state;
    }

    login(loginID: LoginID, password: Password): LoginState {
        if (this.state.state === "try-to-login") {
            return this.state;
        }

        this.state = tryToLogin(delayed(exec(this.client)));

        return this.state;

        async function exec(client: PasswordLoginClient): Promise<LoginState> {
            const response = await client.login(loginID, password);
            if (response.success) {
                return succeedToLogin(response.nonce, response.roles);
            }
            return failedToLogin(response.err);
        }

        async function delayed(promise: Promise<LoginState>): Promise<LoginState> {
            try {
                const delayedMarker = { delayed: true }
                const winner = await Promise.race([
                    promise,
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(delayedMarker);
                        }, LOGIN_DELAY_LIMIT_SECOND * 1000);
                    }),
                ]);

                if (winner === delayedMarker) {
                    return delayedToLogin(promise);
                }

                return await promise;
            } catch (err) {
                return failedToLogin({ type: "infra-error", err });
            }
        }
    }
}
