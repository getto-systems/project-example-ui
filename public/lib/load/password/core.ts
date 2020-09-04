import { PasswordAction, PasswordRecord, PasswordListener } from "./action";
import {
    Password, PasswordBoard, PasswordValidationError, ValidPassword,
    PasswordCharacter, simplePassword, complexPassword,
    PasswordView, showPassword, hidePassword,
} from "./data";

export function passwordAction(): PasswordAction {
    return {
        initPasswordRecord,
    }

    function initPasswordRecord(): PasswordRecord {
        return new PasswordRecordImpl();
    }
}

// bcrypt を想定しているので、72 バイト以上のパスワードは無効
const PASSWORD_MAX_BYTES = 72;

const EMPTY_PASSWORD: Password = { password: "" }
const ERROR: {
    ok: Array<PasswordValidationError>,
    empty: Array<PasswordValidationError>,
    tooLong: Array<PasswordValidationError>,
} = {
    ok: [],
    empty: ["empty"],
    tooLong: ["too-long"],
}

class PasswordRecordImpl implements PasswordRecord {
    password: Password = EMPTY_PASSWORD
    character: PasswordCharacter = simplePassword
    view: PasswordView = hidePassword
    err: Array<PasswordValidationError> = ERROR.ok

    onChange: Array<PasswordListener> = []

    addChangedListener(listener: PasswordListener) {
        this.onChange.push(listener);
    }

    currentBoard(): PasswordBoard {
        return {
            character: this.character,
            view: this.view,
            err: this.err,
        }
    }

    input(password: Password): PasswordBoard {
        this.password = password;
        this.character = this.checkCharacter(password);
        this.err = validatePassword(this.password);
        return this.currentBoard();
    }
    change(): PasswordBoard {
        this.onChange.forEach((listener) => {
            listener(this.password);
        });
        return this.currentBoard();
    }

    checkCharacter(password: Password): PasswordCharacter {
        for (let i = 0; i < password.password.length; i++) {
            if (password.password.charCodeAt(i) >= 128) {
                return complexPassword;
            }
        }
        return simplePassword;
    }

    show(): PasswordBoard {
        this.view = showPassword(this.password);
        return this.currentBoard();
    }
    hide(): PasswordBoard {
        this.view = hidePassword;
        return this.currentBoard();
    }

    validate(): ValidPassword {
        this.err = validatePassword(this.password);
        if (this.err.length > 0) {
            return { valid: false }
        } else {
            return { valid: true, content: this.password }
        }
    }

    clear(): void {
        this.password = EMPTY_PASSWORD;
        this.character = simplePassword;
        this.view = hidePassword;
        this.err = ERROR.ok;
    }
}

function validatePassword(password: Password): Array<PasswordValidationError> {
    if (password.password.length === 0) {
        return ERROR.empty;
    }

    if (Buffer.byteLength(password.password, 'utf8') > PASSWORD_MAX_BYTES) {
        return ERROR.tooLong;
    }

    return [];
}
