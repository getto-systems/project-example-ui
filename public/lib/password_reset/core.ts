import { Infra } from "./infra";

import { ResetEvent, ResetResult, PasswordResetAction } from "./action";

import { LoginID } from "../auth_credential/data";
import { Password } from "../password/data";
import { InputContent, ResetToken } from "./data";
import { Content } from "../input/data";

// 「遅くなっています」を表示するまでの秒数
const RESET_DELAYED_TIME = delaySecond(1);

export function initPasswordResetAction(infra: Infra): PasswordResetAction {
    return new PasswordResetActionImpl(infra);
}

class PasswordResetActionImpl implements PasswordResetAction {
    infra: Infra

    constructor(infra: Infra) {
        this.infra = infra;
    }

    async reset(event: ResetEvent, resetToken: ResetToken, fields: [Content<LoginID>, Content<Password>]): Promise<ResetResult> {
        const content = mapContent(...fields);
        if (!content.valid) {
            event.failedToReset(mapInput(...fields), { type: "validation-error" });
            return { success: false }
        }

        event.tryToReset();

        // ネットワークの状態が悪い可能性があるので、一定時間後に delayed イベントを発行
        const promise = this.infra.passwordResetClient.reset(resetToken, ...content.content);
        const response = await delayed(promise, RESET_DELAYED_TIME, event.delayedToReset);
        if (!response.success) {
            event.failedToReset(mapInput(...fields), response.err);
            return { success: false }
        }

        return { success: true, authCredential: response.authCredential }

        type ValidContent =
            Readonly<{ valid: false }> |
            Readonly<{ valid: true, content: [LoginID, Password] }>

        function mapContent(loginID: Content<LoginID>, password: Content<Password>): ValidContent {
            if (
                !loginID.valid ||
                !password.valid
            ) {
                return { valid: false }
            }
            return { valid: true, content: [loginID.content, password.content] }
        }
        function mapInput(loginID: Content<LoginID>, password: Content<Password>): InputContent {
            return {
                loginID: loginID.input,
                password: password.input,
            }
        }
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
