import { Infra, CredentialRepository } from "./infra";

import { CredentialAction, StoreCredentialApi, LoginIDRecord, LoginIDListener } from "./action";

import {
    LoginID, LoginIDBoard, LoginIDValidationError, ValidLoginID,
    NonceValue, ApiRoles,
    RenewState, renewSuccess, renewFailure,
    StoreCredentialState, initialStoreCredential, tryToStoreCredential, failedToStoreCredential, succeedToStoreCredential,
} from "./data";

export function credentialAction(infra: Infra): CredentialAction {
    return {
        initLoginIDRecord,

        renew,
        initStoreCredentialApi,
    }

    function initLoginIDRecord(): LoginIDRecord {
        return new LoginIDRecordImpl();
    }

    async function renew(): Promise<RenewState> {
        try {
            const nonce = await infra.credentials.findNonce();
            if (nonce.found) {
                const response = await infra.renewClient.renew(nonce.value);
                if (response.success) {
                    await infra.credentials.storeRoles(response.roles);
                    return renewSuccess;
                }

                return renewFailure(response.err);
            }

            return renewFailure({ type: "empty-nonce" });
        } catch (err) {
            return renewFailure({ type: "infra-error", err });
        }
    }

    function initStoreCredentialApi(): StoreCredentialApi {
        return new StoreCredentialApiImpl(infra.credentials);
    }
}

class StoreCredentialApiImpl implements StoreCredentialApi {
    credentials: CredentialRepository

    state: StoreCredentialState = initialStoreCredential

    constructor(credentials: CredentialRepository) {
        this.credentials = credentials;
    }

    currentState(): StoreCredentialState {
        return this.state;
    }
    store(nonce: NonceValue, roles: ApiRoles): StoreCredentialState {
        return tryToStoreCredential(this.storePromise(nonce, roles));
    }

    async storePromise(nonce: NonceValue, roles: ApiRoles): Promise<StoreCredentialState> {
        try {
            await Promise.all([
                this.credentials.storeNonce(nonce),
                this.credentials.storeRoles(roles),
            ]);
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
