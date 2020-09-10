import { AuthAction, AuthEvent, AuthError } from "./auth/action";

import { RenewComponent, initRenew } from "./auth/renew";
import { LoadApplicationComponent, initLoadApplication } from "./auth/load_application";

import { PasswordLoginComponent, initPasswordLogin } from "./auth/password_login";

export interface AuthUsecase {
    initialState(): AuthState
    onStateChange(stateChanged: AuthEventHandler): void

    initRenew(): RenewComponent
    initLoadApplication(): LoadApplicationComponent

    initPasswordLogin(): PasswordLoginComponent
}

export type AuthState =
    Readonly<{ type: "renew" }> |
    Readonly<{ type: "load-application" }> |
    Readonly<{ type: "password-login" }> |
    Readonly<{ type: "error", err: AuthError }>

export interface AuthEventHandler {
    (state: AuthState): void
}

export function initAuthUsecase(url: Readonly<URL>, action: AuthAction): AuthUsecase {
    return new Usecase(url, action);
}

class Usecase implements AuthUsecase {
    url: Readonly<URL>
    action: AuthAction

    eventHolder: EventHolder<UsecaseEvent>

    constructor(url: Readonly<URL>, action: AuthAction) {
        this.url = url;
        this.action = action;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): AuthState {
        return { type: "renew" };
    }

    onStateChange(stateChanged: AuthEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new UsecaseEvent(this.url, stateChanged) }
    }
    event(): AuthEvent {
        return unwrap(this.eventHolder);
    }

    initRenew(): RenewComponent {
        return initRenew(this.action, this.event());
    }
    initLoadApplication(): LoadApplicationComponent {
        return initLoadApplication(this.action, this.event());
    }

    initPasswordLogin(): PasswordLoginComponent {
        return initPasswordLogin(this.action, this.event());
    }
}

class UsecaseEvent implements AuthEvent {
    url: Readonly<URL>
    stateChanged: AuthEventHandler

    constructor(url: Readonly<URL>, stateChanged: AuthEventHandler) {
        this.url = url;
        this.stateChanged = stateChanged;
    }

    tryToLogin(): void {
        // TODO Reset とスイッチするように
        this.stateChanged({ type: "password-login" });

        // ログイン前画面ではアンダースコアで始まる query string を使用する
        /*
        if (url.searchParams.get("_password_reset")) {
            this.stateChanged(auth_PasswordReset);
        } else {
            this.stateChanged(auth_PasswordLogin);
        }
         */
    }
    failedToAuth(err: AuthError): void {
        this.stateChanged({ type: "error", err });
    }
    succeedToAuth(): void {
        this.stateChanged({ type: "load-application" });
    }
}

type EventHolder<T> =
    Readonly<{ hasEvent: false }> |
    Readonly<{ hasEvent: true, event: T }>
function unwrap<T>(holder: EventHolder<T>): T {
    if (!holder.hasEvent) {
        throw new Error("event is not initialized");
    }
    return holder.event;
}
