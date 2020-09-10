import { Infra } from "./infra";

import { AuthCredentialAction, LoginIDField, LoginIDEvent, RenewResult, RenewEvent, StoreEvent } from "./action";

import { LoginID, LoginIDError, AuthCredential } from "./data";
import { InputValue, Content, validContent, invalidContent, Valid, noError, hasError } from "../input/data";

export function initAuthCredentialAction(infra: Infra): AuthCredentialAction {
    return new AuthCredentialActionImpl(infra);
}

// TODO infra に設定オブジェクト的なものを置いたほうがいい
const RENEW_DELAYED_TIME = delaySecond(0.5);

class AuthCredentialActionImpl implements AuthCredentialAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    initLoginIDField(): LoginIDField {
        return new LoginIDFieldImpl();
    }

    async renew(event: RenewEvent): Promise<RenewResult> {
        const findResponse = this.infra.authCredentials.findTicketNonce();
        if (!findResponse.success) {
            event.failedToRenew(findResponse.err);
            return { success: false }
        }

        if (!findResponse.found) {
            // TODO ticket-nonce-not-found がいい
            event.failedToRenew({ type: "empty-nonce" });
            return { success: false }
        }

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.renewClient.renew(findResponse.content);
        const response = await delayed(promise, RENEW_DELAYED_TIME, event.delayedToRenew);
        if (!response.success) {
            event.failedToRenew(response.err);
            return { success: false }
        }

        return { success: true, authCredential: response.authCredential };
    }

    async store(event: StoreEvent, authCredential: AuthCredential): Promise<void> {
        const response = this.infra.authCredentials.storeAuthCredential(authCredential);
        if (!response.success) {
            event.failedToStore(response.err);
            return;
        }

        event.succeedToStore();
    }
}

class LoginIDFieldImpl implements LoginIDField {
    loginID: InputValue

    constructor() {
        this.loginID = { inputValue: "" };
    }

    initialState(): [Valid<LoginIDError>] {
        return [noError()]
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

const ERROR: {
    ok: Array<LoginIDError>,
    empty: Array<LoginIDError>,
} = {
    ok: [],
    empty: ["empty"],
}

function validateLoginID(loginID: string): Array<LoginIDError> {
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
