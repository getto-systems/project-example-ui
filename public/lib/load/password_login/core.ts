import { Infra, PasswordLoginClient } from "./infra";

import { LoginIDRecord } from "../credential/action";
import { PasswordRecord } from "../password/action";
import { PasswordLoginAction, LoginStore, LoginApi } from "./action";

import { LoginIDBoard } from "../credential/data";
import { PasswordBoard } from "../password/data";
import {
    LoginBoard, LoginContent,
    ValidContent, invalidContent, validContent,
    LoginState, initialLogin, tryToLogin, delayedToLogin, failedToLogin, succeedToLogin,
} from "./data";

export function passwordLoginAction(infra: Infra): PasswordLoginAction {
    return {
        initLoginStore,
        initLoginApi,
    }

    function initLoginStore(loginID: LoginIDRecord, password: PasswordRecord): LoginStore {
        return new LoginStoreImpl(loginID, password);
    }
    function initLoginApi(): LoginApi {
        return new LoginApiImpl(infra.passwordLoginClient);
    }
}

/* TODO undo/redo が必要なやつの土台として使える、かも
type HistoryItem =
    Readonly<{ type: "loginID", loginID: LoginID }> |
    Readonly<{ type: "password", password: Password }>
 */

class LoginStoreImpl implements LoginStore {
    impl: {
        loginID: LoginIDRecord
        password: PasswordRecord
    }

    //history: Array<HistoryItem> = []

    constructor(loginID: LoginIDRecord, password: PasswordRecord) {
        this.impl = {
            loginID,
            password,
        }

        //this.loginID().addChangedListener(this.loginIDChanged);
        //this.password().addChangedListener(this.passwordChanged);
    }

    loginID(): LoginIDRecord {
        return this.impl.loginID;
    }
    password(): PasswordRecord {
        return this.impl.password;
    }

    /*
    loginIDChanged(loginID: LoginID): void {
        this.history.push({ type: "loginID", loginID });
    }
    passwordChanged(password: Password): void {
        this.history.push({ type: "password", password });
    }
     */

    currentBoard(): LoginBoard {
        return [this.loginID().currentBoard(), this.password().currentBoard()]
    }

    mapLoginID(loginIDBoard: LoginIDBoard): LoginBoard {
        return [loginIDBoard, this.password().currentBoard()]
    }
    mapPassword(passwordBoard: PasswordBoard): LoginBoard {
        return [this.loginID().currentBoard(), passwordBoard]
    }

    content(): ValidContent<LoginContent> {
        const loginID = this.loginID().validate();
        if (!loginID.valid) {
            return invalidContent();
        }

        const password = this.password().validate();
        if (!password.valid) {
            return invalidContent();
        }

        return validContent([loginID.content, password.content]);
    }

    clear(): LoginBoard {
        this.loginID().clear();
        this.password().clear();
        return this.currentBoard();
    }
}

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

    login(content: LoginContent): LoginState {
        if (this.state.state === "try-to-login") {
            return this.state;
        }

        this.state = tryToLogin(delayed(exec(this.client)));

        return this.state;

        async function exec(client: PasswordLoginClient): Promise<LoginState> {
            const response = await client.login(...content);
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
