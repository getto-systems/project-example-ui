import { LoadAction } from "./action";
import { PasswordLoginTransition } from "./password_login/action";
import { Password } from "./password/data";
import { LoginID, NonceValue, ApiRoles, StoreError } from "./credential/data";
import { LoginBoard, LoginState } from "./password_login/data";

export type PasswordLoginInit = [PasswordLoginState, PasswordLoginComponent]

export type PasswordLoginState =
    Readonly<{ state: "active", board: LoginBoard, login: LoginState }> |
    Readonly<{ state: "try-to-store-credential", next: Promise<PasswordLoginState> }> |
    Readonly<{ state: "failed-to-store-credential", err: StoreError }> |
    Readonly<{ state: "success" }>
function passwordLoginActive(board: LoginBoard, login: LoginState): PasswordLoginState {
    return { state: "active", board, login }
}
function passwordLoginTryToStoreCredential(next: Promise<PasswordLoginState>): PasswordLoginState {
    return { state: "try-to-store-credential", next }
}
function passwordLoginFailedToStoreCredential(err: StoreError): PasswordLoginState {
    return { state: "failed-to-store-credential", err }
}
const passwordLoginSuccess: PasswordLoginState = { state: "success" }

export interface PasswordLoginComponent {
    inputLoginID(loginID: LoginID): PasswordLoginState
    changeLoginID(loginID: LoginID): PasswordLoginState

    inputPassword(password: Password): PasswordLoginState
    changePassword(password: Password): PasswordLoginState

    showPassword(): PasswordLoginState
    hidePassword(): PasswordLoginState

    login(): PasswordLoginState

    map(state: LoginState): PasswordLoginState
}

export function initPasswordLogin(action: LoadAction, transition: PasswordLoginTransition): PasswordLoginInit {
    const board = action.passwordLogin.initLoginBoardStore(
        action.credential.validateLoginID,
        action.password.validatePassword,
        action.password.checkPasswordCharacter,
    );
    const api = action.passwordLogin.initLoginApi();

    return [
        passwordLoginActive(board.currentBoard(), api.currentState()),
        {
            inputLoginID,
            changeLoginID,

            inputPassword,
            changePassword,

            showPassword,
            hidePassword,

            login,

            map,
        },
    ]

    function inputLoginID(loginID: LoginID): PasswordLoginState {
        return passwordLoginActive(board.inputLoginID(loginID), api.currentState());
    }
    function changeLoginID(loginID: LoginID): PasswordLoginState {
        return passwordLoginActive(board.changeLoginID(loginID), api.currentState());
    }

    function inputPassword(password: Password): PasswordLoginState {
        return passwordLoginActive(board.inputPassword(password), api.currentState());
    }
    function changePassword(password: Password): PasswordLoginState {
        return passwordLoginActive(board.changePassword(password), api.currentState());
    }

    function showPassword(): PasswordLoginState {
        return passwordLoginActive(board.showPassword(), api.currentState());
    }
    function hidePassword(): PasswordLoginState {
        return passwordLoginActive(board.hidePassword(), api.currentState());
    }

    function login(): PasswordLoginState {
        const content = board.content();
        if (!content.valid) {
            return passwordLoginActive(board.currentBoard(), api.currentState());
        }
        return passwordLoginActive(board.currentBoard(), api.login(content.loginID, content.password));
    }

    function map(state: LoginState): PasswordLoginState {
        switch (state.state) {
            case "initial-login":
            case "try-to-login":
            case "failed-to-login":
                return passwordLoginActive(board.currentBoard(), state);

            case "succeed-to-login":
                board.clear();
                return passwordLoginTryToStoreCredential(storeCredential(state.nonce, state.roles));

            default:
                return assertNever(state);
        }

        async function storeCredential(nonce: NonceValue, roles: ApiRoles): Promise<PasswordLoginState> {
            const result = await action.credential.store(nonce, roles);
            if (!result.success) {
                return passwordLoginFailedToStoreCredential(result.err);
            }

            // 画面の遷移は state を返してから行う
            setTimeout(() => {
                transition.logined();
            }, 0);

            return passwordLoginSuccess;
        }
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
