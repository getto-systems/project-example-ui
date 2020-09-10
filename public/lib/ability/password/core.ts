import { PasswordAction, PasswordField, PasswordEvent, PasswordRecord, PasswordListener } from "./action";

import {
    Password, PasswordError, PasswordBoard, PasswordValidationError, ValidPassword,
    PasswordCharacter, simplePassword, complexPassword,
    PasswordView, showPassword, hidePassword,
} from "./data";
import {
    InputValue, InitialValue,
    Content, validContent, invalidContent,
    Valid, noError, hasError,
} from "../input/data";

export function initPasswordAction(): PasswordAction {
    return new PasswordActionImpl();
}

class PasswordActionImpl implements PasswordAction {
    initPasswordField(): PasswordField {
        return new PasswordFieldImpl();
    }
    initPasswordRecord(): PasswordRecord {
        return new PasswordRecordImpl();
    }
}

class PasswordFieldImpl implements PasswordField {
    password: InputValue
    visible: boolean

    constructor() {
        this.password = { inputValue: "" };
        this.visible = false;
    }

    initialState(initial: InitialValue): [Valid<PasswordError>, PasswordCharacter, PasswordView] {
        if (!initial.hasValue) {
            return [noError(), { complex: false }, { show: false }]
        }

        this.password = initial.value;
        return this.state();
    }

    setPassword(event: PasswordEvent, input: InputValue): void {
        this.password = input;
        this.validate(event);
    }
    showPassword(event: PasswordEvent): void {
        this.visible = true;
        this.validate(event);
    }
    hidePassword(event: PasswordEvent): void {
        this.visible = false;
        this.validate(event);
    }
    validate(event: PasswordEvent): Content<Password> {
        const state = this.state();
        event.updated(...state);
        return this.content(state[0]);
    }

    toPassword(): Content<Password> {
        return this.content(this.state()[0]);
    }
    view(): PasswordView {
        if (this.visible) {
            return showPassword({ password: this.password.inputValue });
        } else {
            return hidePassword;
        }
    }

    state(): [Valid<PasswordError>, PasswordCharacter, PasswordView] {
        const result = hasError(validatePassword(this.password.inputValue));
        return [result, checkCharacter(this.password.inputValue), this.view()];
    }
    content(result: Valid<PasswordError>): Content<Password> {
        if (!result.valid) {
            return invalidContent(this.password);
        }
        return validContent(this.password, { password: this.password.inputValue });
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
        this.err = validatePassword(this.password.password);
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
        this.err = validatePassword(this.password.password);
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

function validatePassword(password: string): Array<PasswordValidationError> {
    if (password.length === 0) {
        return ERROR.empty;
    }

    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
        return ERROR.tooLong;
    }

    return [];
}
function checkCharacter(password: string): PasswordCharacter {
    for (let i = 0; i < password.length; i++) {
        if (password.charCodeAt(i) >= 128) {
            return complexPassword;
        }
    }
    return simplePassword;
}
