import { Infra } from "./infra";

import { CredentialAction, LoginIDRecord, LoginIDListener } from "./action";

import {
    LoginID, LoginIDBoard, LoginIDValidationError, ValidLoginID,
    NonceValue, ApiRoles,
    StoreState, loginSuccess, loginFailure,
    RenewState, renewSuccess, renewFailure,
} from "./data";

export function credentialAction(infra: Infra): CredentialAction {
    return {
        initLoginIDRecord,

        store,
        renew,
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

    async function store(nonce: NonceValue, roles: ApiRoles): Promise<StoreState> {
        try {
            await Promise.all([
                infra.credentials.storeNonce(nonce),
                infra.credentials.storeRoles(roles),
            ]);
            return loginSuccess;
        } catch (err) {
            return loginFailure({ type: "infra-error", err });
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
