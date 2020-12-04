import { RenewRunner } from "../infra"

import { LoginAt } from "../../../common/credential/data"

export function initRenewRunner(): RenewRunner {
    return new Runner()
}

class Runner implements RenewRunner {
    nextRun(lastLoginAt: LoginAt, delay: DelayTime): DelayTime {
        const delay_millisecond = lastLoginAt.getTime() + delay.delay_millisecond - new Date().getTime()
        if (delay_millisecond < 0) {
            return { delay_millisecond: 0 }
        }
        return { delay_millisecond }
    }
}

type DelayTime = Readonly<{ delay_millisecond: number }>
