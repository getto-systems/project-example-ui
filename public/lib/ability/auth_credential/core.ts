import { Infra, AuthCredentialRepository } from "./infra";

import { AuthCredentialAction, StoreCredentialApi, LoginIDRecord, LoginIDListener } from "./action";

import {
    LoginID, LoginIDBoard, LoginIDValidationError, ValidLoginID,
    AuthCredential,
    RenewState, renewSuccess, renewFailure,
    StoreCredentialState, initialStoreCredential, tryToStoreCredential, failedToStoreCredential, succeedToStoreCredential,
} from "./data";

export function initAuthCredentialAction(infra: Infra): AuthCredentialAction {
    return new AuthCredentialActionImpl(infra);
}

class AuthCredentialActionImpl implements AuthCredentialAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
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
        this.err = validateLoginID(this.loginID);
        return this.currentBoard();
    }
    change(): LoginIDBoard {
        this.onChange.forEach((listener) => {
            listener(this.loginID);
        });
        return this.currentBoard();
    }

    validate(): ValidLoginID {
        this.err = validateLoginID(this.loginID);
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

function validateLoginID(loginID: LoginID): Array<LoginIDValidationError> {
    if (loginID.loginID.length === 0) {
        return ERROR.empty;
    }

    return ERROR.ok;
}
