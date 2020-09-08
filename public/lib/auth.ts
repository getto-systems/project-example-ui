import { AuthAction, AuthEvent } from "./auth/action";

import { RenewComponent, initRenew } from "./auth/renew";
//import { LoadApplicationComponent, initLoadApplication } from "./auth/load_application";

import { RenewError } from "./ability/auth_credential/data";

export interface AuthUsecase {
    initialState(): AuthState
    onStateChange(stateChanged: AuthEventHandler): void

    initRenew(): RenewComponent
    //initLoadApplication(): LoadApplicationComponent
}

export type AuthState =
    Readonly<{ view: "renew" }> |
    Readonly<{ view: "load-application" }> |
    Readonly<{ view: "error", err: string }>
const auth_Renew: AuthState = { view: "renew" }
const auth_LoadApplication: AuthState = { view: "load-application" }
function auth_Error(err: string): AuthState {
    return { view: "error", err }
}

export interface AuthEventHandler {
    (state: AuthState): void
}

export function initAuthUsecase(url: Readonly<URL>, action: AuthAction): AuthUsecase {
    return new AuthUsecaseImpl(url, action);
}

class AuthUsecaseImpl implements AuthUsecase {
    url: Readonly<URL>
    action: AuthAction

    eventHolder: EventHolder<AuthEvent>

    constructor(url: Readonly<URL>, action: AuthAction) {
        this.url = url;
        this.action = action;
        this.eventHolder = { hasEvent: false }
    }

    initialState(): AuthState {
        return auth_Renew;
    }

    onStateChange(stateChanged: AuthEventHandler): void {
        this.eventHolder = { hasEvent: true, event: new AuthEventImpl(this.url, stateChanged) }
    }
    event(): AuthEvent {
        return unwrap(this.eventHolder);
    }

    initRenew(): RenewComponent {
        return initRenew(this.action, this.event());
    }

    /*
    initLoadApplication(): LoadApplicationComponent {
        return initLoadApplication(this.action, this.event());
    }
     */
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

class AuthEventImpl implements AuthEvent {
    url: Readonly<URL>
    stateChanged: AuthEventHandler

    constructor(url: Readonly<URL>, stateChanged: AuthEventHandler) {
        this.url = url;
        this.stateChanged = stateChanged;
    }

    failedToRenew(err: RenewError): void {
        // TODO ちゃんとログイン画面に遷移するように
        this.stateChanged(auth_Error(`ここでログインフォーム: ${err}`));

        // ログイン前画面ではアンダースコアで始まる query string を使用する
        /*
        if (url.searchParams.get("_password_reset")) {
            this.stateChanged(auth_PasswordReset);
        } else {
            this.stateChanged(auth_PasswordLogin);
        }
         */
    }
    succeedToRenew(): void {
        this.stateChanged(auth_LoadApplication);
    }
}
