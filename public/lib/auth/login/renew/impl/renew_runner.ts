import { RenewRunner } from "../infra"

import { LoginAt } from "../../../common/credential/data"

export function initRenewRunner(): RenewRunner {
    return new Runner()
}

class Runner implements RenewRunner {
    nextRun(lastLoginAt: LoginAt, delay: DelayTime): boolean {
        return new Date().getTime() > lastLoginAt.getTime() + delay.delay_millisecond
    }
}

type DelayTime = Readonly<{ delay_millisecond: number }>
