import { Infra, AuthCredentialRepository } from "./infra";

import {
    AuthCredentialAction,
    LoginIDField, LoginIDEvent,
    RenewResult, RenewEvent, StoreEvent,
    StoreCredentialApi, LoginIDRecord, LoginIDListener,
} from "./action";

import {
    LoginID, LoginIDError, LoginIDBoard, LoginIDValidationError, ValidLoginID,
    AuthCredential,
    RenewState, renewSuccess, renewFailure,
    StoreCredentialState, initialStoreCredential, tryToStoreCredential, failedToStoreCredential, succeedToStoreCredential,
} from "./data";
import {
    InputValue, InitialValue,
    Content, validContent, invalidContent,
    Valid, noError, hasError,
} from "../input/data";

export function initAuthCredentialAction(infra: Infra): AuthCredentialAction {
    return new AuthCredentialActionImpl(infra);
}

// TODO infra に設定オブジェクト的なものを置いたほうがいい
const RENEW_DELAYED_TIME = delaySecond(1);

class AuthCredentialActionImpl implements AuthCredentialAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    initLoginIDField(): LoginIDField {
        return new LoginIDFieldImpl();
    }
    initLoginIDRecord(): LoginIDRecord {
        return new LoginIDRecordImpl();
    }

    async renew(): Promise<RenewState> {
        try {
            const ticketNonce = await this.infra.authCredentials.findTicketNonce();
            if (ticketNonce.found) {
                const response = await this.infra.renewClient.renew(ticketNonce.ticketNonce);
                if (response.success) {
                    await this.infra.authCredentials.storeAuthCredential(response.authCredential);
                    return renewSuccess;
                }

                return renewFailure(response.err);
            }

            return renewFailure({ type: "empty-nonce" });
        } catch (err) {
            return renewFailure({ type: "infra-error", err });
        }
    }

    initStoreCredentialApi(): StoreCredentialApi {
        return new StoreCredentialApiImpl(this.infra.authCredentials);
    }

    async renew_withEvent(event: RenewEvent): Promise<RenewResult> {
        // TODO エラーは infra で包む
        try {
            const ticketNonce = await this.infra.authCredentials.findTicketNonce();
            if (!ticketNonce.found) {
                // TODO ticket-nonce-not-found がいい
                event.failedToRenew({ type: "empty-nonce" });
                return { success: false }
            }

            // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
            const promise = this.infra.renewClient.renew(ticketNonce.ticketNonce);
            const response = await delayed(promise, RENEW_DELAYED_TIME, event.delayedToRenew);
            if (!response.success) {
                event.failedToRenew(response.err);
                return { success: false }
            }

            return { success: true, authCredential: response.authCredential };
        } catch (err) {
            event.failedToRenew({ type: "infra-error", err });
            return { success: false }
        }
    }

    async store_withEvent(event: StoreEvent, authCredential: AuthCredential): Promise<void> {
        // TODO エラーは infra で包む
        try {
            event.tryToStore();

            await this.infra.authCredentials.storeAuthCredential(authCredential);

            event.succeedToStore();
        } catch (err) {
            event.failedToStore({ type: "infra-error", err });
        }
    }
}

class LoginIDFieldImpl implements LoginIDField {
    loginID: InputValue

    constructor() {
        this.loginID = { inputValue: "" };
    }

    initialState(initial: InitialValue): [Valid<LoginIDError>] {
        if (!initial.hasValue) {
            return [noError()]
        }

        this.loginID = initial.value;
        return this.state()
    }

    setLoginID(event: LoginIDEvent, input: InputValue): void {
        this.loginID = input;
        this.validate(event);
    }
    validate(event: LoginIDEvent): Content<LoginID> {
        const state = this.state();
        event.updated(...state);
        return this.content(state[0]);
    }

    toLoginID(): Content<LoginID> {
        return this.content(this.state()[0]);
    }

    state(): [Valid<LoginIDError>] {
        return [hasError(validateLoginID(this.loginID.inputValue))];
    }
    content(result: Valid<LoginIDError>): Content<LoginID> {
        if (!result.valid) {
            return invalidContent(this.loginID);
        }
        return validContent(this.loginID, { loginID: this.loginID.inputValue });
    }
}

class StoreCredentialApiImpl implements StoreCredentialApi {
    authCredentials: AuthCredentialRepository

    state: StoreCredentialState = initialStoreCredential

    constructor(authCredentials: AuthCredentialRepository) {
        this.authCredentials = authCredentials;
    }

    currentState(): StoreCredentialState {
        return this.state;
    }
    store(authCredential: AuthCredential): StoreCredentialState {
        return tryToStoreCredential(this.storePromise(authCredential));
    }

    async storePromise(authCredential: AuthCredential): Promise<StoreCredentialState> {
        // TODO infra からの return を返すべき。あと、エラーは infra で包むべき
        try {
            await this.authCredentials.storeAuthCredential(authCredential);
            return succeedToStoreCredential;
        } catch (err) {
            return failedToStoreCredential({ type: "infra-error", err });
        }
    }
}

const EMPTY_LOGIN_ID: LoginID = { loginID: "" }
const ERROR: {
    ok: Array<LoginIDValidationError>,
    empty: Array<LoginIDValidationError>,
} = {
    ok: [],
    empty: ["empty"],
}

class LoginIDRecordImpl implements LoginIDRecord {
    loginID: LoginID = EMPTY_LOGIN_ID
    err: Array<LoginIDValidationError> = ERROR.ok

    onChange: Array<LoginIDListener> = []

    addChangedListener(listener: LoginIDListener): void {
        this.onChange.push(listener);
    }

    currentBoard(): LoginIDBoard {
        return {
            err: this.err,
        }
    }

    input(loginID: LoginID): LoginIDBoard {
        this.loginID = loginID;
        this.err = validateLoginID(this.loginID.loginID);
        return this.currentBoard();
    }
    change(): LoginIDBoard {
        this.onChange.forEach((listener) => {
            listener(this.loginID);
        });
        return this.currentBoard();
    }

    validate(): ValidLoginID {
        this.err = validateLoginID(this.loginID.loginID);
        if (this.err.length > 0) {
            return { valid: false }
        } else {
            return { valid: true, content: this.loginID }
        }
    }

    clear(): void {
        this.loginID = EMPTY_LOGIN_ID;
        this.err = ERROR.ok;
    }
}

function validateLoginID(loginID: string): Array<LoginIDValidationError> {
    if (loginID.length === 0) {
        return ERROR.empty;
    }

    return ERROR.ok;
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
