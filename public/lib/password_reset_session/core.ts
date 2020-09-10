import { Infra, PasswordResetSessionClient } from "./infra";

import {
    PasswordResetSessionAction,
    SessionEvent, SessionResult,
    PollingStatusEvent,
} from "./action";

import { LoginID } from "../auth_credential/data";
import { InputContent, Session, PollingStatusError } from "./data";
import { Content } from "../input/data";

export function initPasswordResetSessionAction(infra: Infra): PasswordResetSessionAction {
    return new PasswordResetSessionActionImpl(infra);
}

// TODO infra に設定オブジェクト的なものを置いたほうがいい
const CREATE_SESSION_DELAYED_TIME = delaySecond(1);
const POLLING_WAIT_TIME = delaySecond(1);
const POLLING_LIMIT = 30;

class PasswordResetSessionActionImpl implements PasswordResetSessionAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    async createSession(event: SessionEvent, fields: [Content<LoginID>]): Promise<SessionResult> {
        const content = mapContent(...fields);
        if (!content.valid) {
            event.failedToCreateSession(mapInput(...fields), { type: "validation-error" });
            return { success: false }
        }

        event.tryToCreateSession();

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.passwordResetSessionClient.createSession(...content.content);
        const response = await delayed(promise, CREATE_SESSION_DELAYED_TIME, event.delayedToCreateSession);
        if (!response.success) {
            event.failedToCreateSession(mapInput(...fields), response.err);
            return { success: false }
        }

        return { success: true, session: response.session }

        type ValidContent =
            Readonly<{ valid: false }> |
            Readonly<{ valid: true, content: [LoginID] }>

        function mapContent(loginID: Content<LoginID>): ValidContent {
            if (!loginID.valid) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content] }
        }
        function mapInput(loginID: Content<LoginID>): InputContent {
            return {
                loginID: loginID.input,
            }
        }
    }

    async startPollingStatus(event: PollingStatusEvent, session: Session): Promise<void> {
        new PollingStatus(this.infra.passwordResetSessionClient).startPolling(event, session);
    }
}

type SendTokenState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "failed", err: PollingStatusError }> |
    Readonly<{ type: "success" }>

class PollingStatus {
    client: PasswordResetSessionClient

    sendTokenState: SendTokenState

    constructor(client: PasswordResetSessionClient) {
        this.client = client;

        this.sendTokenState = { type: "initial" }
    }

    async startPolling(event: PollingStatusEvent, session: Session): Promise<void> {
        event.tryToPollingStatus();

        this.sendToken();

        let count = 0;

        while (count < POLLING_LIMIT) {
            count += 1;

            if (this.sendTokenState.type === "failed") {
                event.failedToPollingStatus(this.sendTokenState.err);
                return;
            }

            const response = await this.client.getStatus(session);
            if (!response.success) {
                event.failedToPollingStatus(response.err);
                return;
            }

            if (response.done) {
                event.succeedToSendToken(response.status);
                return;
            }

            event.retryToPollingStatus(response.status);

            await this.wait(POLLING_WAIT_TIME);
        }

        event.failedToPollingStatus({ type: "infra-error", err: "overflow polling limit" });
    }

    async sendToken(): Promise<void> {
        // TODO エラーは infra で吸収
        try {
            const response = await this.client.sendToken();
            if (response.success) {
                this.sendTokenState = { type: "success" }
            } else {
                this.sendTokenState = { type: "failed", err: response.err }
            }
        } catch (err) {
            this.sendTokenState = { type: "failed", err: { type: "infra-error", err } }
        }
    }

    wait(time: DelayTime): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, time.milli_second);
        });
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
