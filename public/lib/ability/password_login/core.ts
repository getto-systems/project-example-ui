import { Infra, PasswordLoginClient } from "./infra";

import { LoginIDRecord } from "../auth_credential/action";
import { PasswordRecord } from "../password/action";
import {
    PasswordLoginAction,
    LoginEvent, LoginResult, LoginStore, LoginApi,
} from "./action";

import { LoginID, LoginIDBoard } from "../auth_credential/data";
import { Password, PasswordBoard } from "../password/data";
import {
    LoginBoard, LoginContent, ValidLoginContent, InputContent,
    ValidContent, invalidContent, validContent,
    LoginState, initialLogin, tryToLogin, delayedToLogin, failedToLogin, succeedToLogin,
} from "./data";
import { Content } from "../input/data";

export function initPasswordLoginAction(infra: Infra): PasswordLoginAction {
    return new PasswordLoginActionImpl(infra);
}

// TODO infra に設定オブジェクト的なものを置いたほうがいい
const LOGIN_DELAYED_TIME = delaySecond(1);

class PasswordLoginActionImpl implements PasswordLoginAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    async login(event: LoginEvent, fields: [Content<LoginID>, Content<Password>]): Promise<LoginResult> {
        const content = mapContent(...fields);
        if (!content.valid) {
            event.failedToLogin(mapInput(...fields), { type: "validation-error" });
            return { success: false }
        }

        event.tryToLogin();

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.passwordLoginClient.login(...content.content);
        const response = await delayed(promise, LOGIN_DELAYED_TIME, event.delayedToLogin);
        if (!response.success) {
            event.failedToLogin(mapInput(...fields), response.err);
            return { success: false }
        }

        return { success: true, authCredential: response.authCredential };

        function mapContent(loginID: Content<LoginID>, password: Content<Password>): ValidLoginContent {
            if (
                !loginID.valid ||
                !password.valid
            ) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content, password.content] }
        }
        function mapInput(loginID: Content<LoginID>, password: Content<Password>): InputContent {
            return {
                loginID: loginID.input,
                password: password.input,
            }
        }
    }

    initLoginStore(loginID: LoginIDRecord, password: PasswordRecord): LoginStore {
        return new LoginStoreImpl(loginID, password);
    }
    initLoginApi(): LoginApi {
        return new LoginApiImpl(this.infra.passwordLoginClient);
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
                return succeedToLogin(response.authCredential);
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

async function delayed<T>(promise: Promise<T>, time: DelayTime, handler: DelayedHandler): Promise<T> {
    const DELAYED_MARKER = { DELAYED: true }
    const delayed = new Promise((resolve) => {
        setTimeout(() => {
            resolve(DELAYED_MARKER);
        }, time.milli_second);
    });

    const winner = await Promise.race([promise, delayed]);
    if (winner === DELAYED_MARKER) {
        handler();
    }

    return await promise;
}

type DelayTime = { milli_second: number }
function delaySecond(second: number): DelayTime {
    return { milli_second: second * 1000 }
}

interface DelayedHandler {
    (): void
}
